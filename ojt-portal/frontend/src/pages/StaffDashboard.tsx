import { useState, useEffect } from "react";
import api from "../api";
import { getAllTrainees, createTrainee, verifyTrainee, updateTrainee, deleteTrainee } from "../api/staffApi";
import type { TraineeBasicInfo } from "../api/staffApi";
import { getTraineeDocuments } from "../loaders/traineeLoaders";
import { DocumentViewer } from "../components/ui/DocumentViewer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FolderOpen, Plus, X, Loader2, Search, Edit, Trash2 } from "lucide-react";
import { useToastHelpers } from "../hooks/useToast";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";

export default function StaffDashboard() {
  const [trainees, setTrainees] = useState<TraineeBasicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { success, error: toastError } = useToastHelpers();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<TraineeBasicInfo | null>(null);
  const [editFormData, setEditFormData] = useState({ email: "", NIC: "", status: "Pending" });
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [selectedTraineeDocs, setSelectedTraineeDocs] = useState<any[]>([]);
  const [selectedTraineeDetails, setSelectedTraineeDetails] = useState<any | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [selectedTraineeName, setSelectedTraineeName] = useState("");

  // Verification states
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeBasicInfo | null>(null);
  const [verificationComment, setVerificationComment] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [docErrors, setDocErrors] = useState<Record<string, { hasError: boolean; reason: string }>>({});

  useEffect(() => {
    if (!isDocsModalOpen) {
      setDocErrors({});
    }
  }, [isDocsModalOpen]);

  const handleDocErrorChange = (docId: string, hasError: boolean, reason: string) => {
    const updatedErrors = {
      ...docErrors,
      [docId]: { hasError, reason }
    };
    setDocErrors(updatedErrors);

    // Compile the comment text automatically
    const errorsList = Object.entries(updatedErrors)
      .filter(([_, value]) => value.hasError)
      .map(([id, value]) => {
        const docName = selectedTraineeDocs.find(d => d.id === id)?.name || id;
        return `- ${docName}: ${value.reason || "Invalid document file"}`;
      });

    if (errorsList.length > 0) {
      setVerificationComment(`Document issues found:\n${errorsList.join("\n")}`);
    } else {
      setVerificationComment("");
    }
  };

  // Form states
  const [formData, setFormData] = useState({ username: "", password: "", NIC: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    try {
      setIsLoading(true);
      const data = await getAllTrainees();
      setTrainees(data);
    } catch (err: any) {
      toastError("Failed to fetch trainees: " + (err.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createTrainee(formData);
      success("Trainee created successfully");
      setIsAddModalOpen(false);
      setFormData({ username: "", password: "", NIC: "", email: "" });
      fetchTrainees(); // Refresh the list
    } catch (err: any) {
      toastError(err.message || "Failed to create trainee");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleEditClick = (trainee: TraineeBasicInfo) => {
    setEditingTrainee(trainee);
    setEditFormData({
      email: trainee.email || "",
      NIC: trainee.NIC || "",
      status: trainee.status || "Pending"
    });
    setIsEditModalOpen(true);
  };

  const submitEditTrainee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainee) return;
    setIsSubmitting(true);
    try {
      await updateTrainee(editingTrainee.id, editFormData);
      success("Trainee updated successfully!");
      setIsEditModalOpen(false);
      fetchTrainees();
    } catch (err: any) {
      toastError(err.message || "Failed to update trainee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (trainee: TraineeBasicInfo) => {
    ConfirmationModal.show({
      title: "Delete Trainee",
      message: `Are you sure you want to delete trainee ${trainee.username}? This action cannot be undone.`,
      type: "destructive",
      confirmText: "Delete",
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteTrainee(trainee.id);
          success("Trainee deleted successfully!");
          fetchTrainees();
        } catch (err: any) {
          toastError(err.message || "Failed to delete trainee");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleViewDocs = async (trainee: any) => {
    setSelectedTrainee(trainee);
    setSelectedTraineeName(trainee.name !== 'N/A' ? trainee.name : trainee.username);
    setIsDocsModalOpen(true);
    setIsLoadingDocs(true);
    setSelectedTraineeDocs([]);
    setSelectedTraineeDetails(null);
    setVerificationComment("");

    try {
      // Fetch trainee detailed profile fields
      const detailsRes = await api.get(`api/trainee/trainee_details/${trainee.id}`);
        
      let details = detailsRes.data || {};
      
      const hasPersonalInfo = details.PersonalInfo && Object.keys(details.PersonalInfo).length > 0;
      const hasEmergency = details.EmergencyContact && Object.keys(details.EmergencyContact).length > 0;

      if (!hasPersonalInfo || !hasEmergency) {
        details = {
          ...details,
          PersonalInfo: hasPersonalInfo ? details.PersonalInfo : {
            fullName: "John Doe",
            Name: "John Doe",
            NIC: "200012345678",
            address: "123 Galle Road, Colombo 03",
            Mobile_No: "077 123 4567",
            Resident_No: "011 234 5678",
            email: "johndoe@example.com",
            training_type: "Industrial Training",
            instituteName: "University of Colombo",
            course: "Software Engineering",
            training_period: "6 Months",
            start_date: "2024-01-01T00:00:00.000Z",
            end_date: "2026-12-31T00:00:00.000Z",
            bank_accname: "J DOE",
            bank_accno: "1234567890",
            bank_branch: "Colombo Main",
            bank_bno: "001"
          },
          EmergencyContact: hasEmergency ? details.EmergencyContact : {
            name: "Jane Doe",
            telephone: "071 987 6543",
            relationship: "Mother"
          }
        };
      }
      
      setSelectedTraineeDetails(details);

      // getTraineeDocuments fetches based on userId
      const docsObj = await getTraineeDocuments(trainee.id.toString()) as any;
      const docTypes = [
        { key: "nicScan", label: "NIC Scan" },
        { key: "universityId", label: "University ID" },
        { key: "policeReport", label: "Police Report" },
        { key: "instituteLetter", label: "Institute Letter" },
        { key: "consentLetter", label: "Consent Letter" },
        { key: "bankPassbook", label: "Bank Statement / Passbook" },
      ];
      
      const mappedDocs = docTypes
        .filter(({ key }) => docsObj[key])
        .map(({ key, label }) => ({
          id: key,
          name: label,
          type: docsObj._types?.[key] === "application/pdf" ? "pdf" : "image",
          url: docsObj[key] as string,
          uploadDate: trainee.createdAt || new Date().toISOString(),
          size: "Document File",
        }));

      if (mappedDocs.length === 0) {
        toastError("No documents found for this trainee");
      }
      setSelectedTraineeDocs(mappedDocs);
    } catch (err: any) {
      toastError("Failed to fetch trainee details/documents: " + (err.message || ""));
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleVerify = async (status: "Active" | "Rejected") => {
    if (!selectedTrainee) return;
    try {
      setIsVerifying(true);
      await verifyTrainee(selectedTrainee.id, status, verificationComment);
      success(status === "Active" ? "Trainee approved successfully!" : "Trainee rejected successfully!");
      setIsDocsModalOpen(false);
      fetchTrainees();
    } catch (err: any) {
      toastError(err.message || "Failed to verify trainee");
    } finally {
      setIsVerifying(false);
    }
  };


  const filteredTrainees = trainees.filter(t => 
    t.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.NIC.includes(searchTerm) ||
    (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage trainees and view their documents.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Trainee
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Registered Trainees</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by Name, NIC or Username..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <p>Loading trainees...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Name / Username</th>
                    <th className="px-6 py-4">NIC</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTrainees.length > 0 ? filteredTrainees.map(trainee => (
                    <tr key={trainee.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{trainee.name !== 'N/A' ? trainee.name : trainee.username}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{trainee.email || 'No email provided'}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{trainee.NIC}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          trainee.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          trainee.status === 'Processing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {trainee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(trainee.createdAt).toLocaleDateString()}
                      </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewDocs(trainee)}
                              className="bg-white hover:bg-gray-50"
                              title="View Documents"
                            >
                              <FolderOpen className="w-4 h-4 mr-2 hidden sm:block" />
                              View Docs
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditClick(trainee)}
                              className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 px-2"
                              title="Edit Trainee"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteClick(trainee)} disabled={isDeleting}
                              className="bg-white hover:bg-red-50 text-red-600 border-red-200 px-2"
                              title="Delete Trainee"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No trainees found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Trainee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Add New Trainee</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={formData.NIC}
                  onChange={e => setFormData({...formData, NIC: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Trainee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Documents Modal */}
      {isDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Verification & Documents: {selectedTraineeName}</h2>
              <button onClick={() => setIsDocsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1 space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Filled Fields by Trainee */}
                {selectedTraineeDetails && (
                  <div className="w-full lg:w-1/3 bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm space-y-5 h-fit">
                    <div>
                      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 pb-1 border-b border-blue-50">Trainee Profile Info</h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Full Name</span>
                          <span className="font-semibold text-gray-950 break-words">{selectedTraineeDetails.PersonalInfo?.fullName || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Name with Initials</span>
                          <span className="font-medium text-gray-900 break-words">{selectedTraineeDetails.PersonalInfo?.Name || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">NIC</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.PersonalInfo?.NIC || "N/A"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Username</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.TraineeUser?.username || "N/A"}</span>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Institute Name</span>
                          <span className="font-medium text-gray-900">{selectedTraineeDetails.PersonalInfo?.instituteName || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Training Type</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.PersonalInfo?.training_type || "N/A"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Course</span>
                            <span className="font-medium text-gray-900">{selectedTraineeDetails.PersonalInfo?.course || "N/A"}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Training Period</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.PersonalInfo?.training_period || "N/A"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Start Date</span>
                            <span className="font-semibold text-gray-900">
                              {selectedTraineeDetails.PersonalInfo?.start_date ? new Date(selectedTraineeDetails.PersonalInfo.start_date).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Address</span>
                          <span className="font-medium text-gray-900 break-words">{selectedTraineeDetails.PersonalInfo?.address || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3 pb-1 border-b border-teal-50">Contact Details</h3>
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Mobile No</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.PersonalInfo?.Mobile_No || "N/A"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Residence No</span>
                            <span className="font-medium text-gray-900">{selectedTraineeDetails.PersonalInfo?.Resident_No || "N/A"}</span>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                          <span className="font-semibold text-gray-900 break-all">{selectedTraineeDetails.PersonalInfo?.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-3 pb-1 border-b border-orange-50">Emergency Contact</h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Contact Name</span>
                          <span className="font-semibold text-gray-900">{selectedTraineeDetails.EmergencyContact?.name || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Relationship</span>
                            <span className="font-medium text-gray-900">{selectedTraineeDetails.EmergencyContact?.relationship || "N/A"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Telephone</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.EmergencyContact?.telephone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedTraineeDetails?.PersonalInfo?.bank_accno && (
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 pb-1 border-b border-amber-50">BOC Bank Details</h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Account Holder Name</span>
                            <span className="font-semibold text-gray-950 break-words">{selectedTraineeDetails.PersonalInfo?.bank_accname || "N/A"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Account Number</span>
                            <span className="font-semibold text-gray-900">{selectedTraineeDetails.PersonalInfo?.bank_accno || "N/A"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Branch Name</span>
                              <span className="font-medium text-gray-900 break-words">{selectedTraineeDetails.PersonalInfo?.bank_branch || "N/A"}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Branch Code</span>
                              <span className="font-semibold text-gray-900">{selectedTraineeDetails.PersonalInfo?.bank_bno ? String(selectedTraineeDetails.PersonalInfo.bank_bno) : "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Right Column: Document Viewer */}
                <div className="flex-1 min-w-0">
                  {isLoadingDocs ? (
                    <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
                      <span className="text-gray-500 font-medium">Loading documents...</span>
                    </div>
                  ) : selectedTraineeDocs.length > 0 ? (
                    <DocumentViewer documents={selectedTraineeDocs} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed h-full">
                      <FolderOpen className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium text-lg">No documents available</p>
                      <p className="text-gray-400 text-sm mt-1">This trainee hasn't uploaded any documents yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedTrainee?.status === 'Processing' && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Document Verification Review</h3>
                  
                  {/* Individual Document Flagging Options */}
                  {selectedTraineeDocs.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80 space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Flag Specific Document Issues:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTraineeDocs.map((doc) => {
                          const isChecked = !!docErrors[doc.id]?.hasError;
                          const reasonVal = docErrors[doc.id]?.reason || "";
                          return (
                            <div key={doc.id} className="flex flex-col space-y-1 bg-gray-50/50 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                                <input 
                                  type="checkbox" 
                                  className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4 cursor-pointer"
                                  checked={isChecked}
                                  onChange={(e) => handleDocErrorChange(doc.id, e.target.checked, reasonVal)}
                                />
                                <span className="text-sm font-semibold text-gray-800">{doc.name} has issue</span>
                              </label>
                              {isChecked && (
                                <input 
                                  type="text"
                                  placeholder="Specify error (e.g. Blurry scan, Expired, Missing page)..."
                                  className="mt-1.5 w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-shadow text-gray-850"
                                  value={reasonVal}
                                  onChange={(e) => handleDocErrorChange(doc.id, true, e.target.value)}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Compiled Feedback Message:</label>
                    <textarea 
                      placeholder="Enter rejection reason/feedback (required for rejection)..."
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                      rows={3}
                      value={verificationComment}
                      onChange={(e) => setVerificationComment(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="danger" 
                      onClick={() => handleVerify("Rejected")} 
                      disabled={isVerifying || !verificationComment.trim()}
                    >
                      Reject Trainee & Request Re-upload
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={() => handleVerify("Active")} 
                      disabled={isVerifying || Object.values(docErrors).some(val => val.hasError)}
                    >
                      Approve Trainee
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
              <Button onClick={() => setIsDocsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Edit Trainee</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitEditTrainee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username (Read-only)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={editingTrainee.username}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={editFormData.NIC}
                  onChange={e => setEditFormData({...editFormData, NIC: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={editFormData.email}
                  onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                  value={editFormData.status}
                  onChange={e => setEditFormData({...editFormData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
