import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import "./Courses.css";

const streamClassMap = {
  "Maritime & Seamanship": "stream-maritime-seamanship",
  "Occupational Health & Safety": "stream-health-safety",
  "Port Operation & Logistics": "stream-port-logistics",
  Technical: "stream-technical",
  "Management & IS": "stream-management-is",
};

// Define stream order for consistent display
const streamOrder = [
  "Maritime & Seamanship",
  "Occupational Health & Safety",
  "Port Operation & Logistics",
  "Technical",
  "Management & IS",
];

// Smooth 3D tilt card wrapper
const TiltCard = ({ children, className, onClick }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const currentTilt = useRef({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const animate = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.current.x, 0.08);
    currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.current.y, 0.08);
    const { x, y } = currentTilt.current;
    card.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1.03, 1.03, 1.03)`;
    if (
      Math.abs(currentTilt.current.x - targetTilt.current.x) > 0.01 ||
      Math.abs(currentTilt.current.y - targetTilt.current.y) > 0.01
    ) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    targetTilt.current = { x: (0.5 - py) * 12, y: (px - 0.5) * 12 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
    const reset = () => {
      const card = cardRef.current;
      if (!card) return;
      currentTilt.current.x = lerp(currentTilt.current.x, 0, 0.06);
      currentTilt.current.y = lerp(currentTilt.current.y, 0, 0.06);
      card.style.transform = `perspective(800px) rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg) scale3d(1, 1, 1)`;
      if (Math.abs(currentTilt.current.x) > 0.01 || Math.abs(currentTilt.current.y) > 0.01) {
        rafRef.current = requestAnimationFrame(reset);
      } else {
        card.style.transform = '';
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(reset);
  }, []);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStream, setSelectedStream] = useState("All");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const navigate = useNavigate();

  // PDF Download Function
  const handleDownloadPDF = () => {
    if (courses.length === 0) {
      alert("No courses available to download.");
      return;
    }

    setIsGeneratingPdf(true);

    // Use setTimeout to ensure React state updates complete
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header with gradient-like effect
        doc.setFillColor(30, 58, 95);
        doc.rect(0, 0, pageWidth, 40, "F");

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MPMA Course Catalog", pageWidth / 2, 20, { align: "center" });

        // Subtitle
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Mahapola Ports & Maritime Academy", pageWidth / 2, 30, {
          align: "center",
        });

        // Generated date
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(
          `Generated: ${new Date().toLocaleDateString()}`,
          pageWidth / 2,
          50,
          { align: "center" },
        );

        let yPosition = 60;

        // Group courses by stream for PDF
        const pdfGroupedCourses = courses.reduce((acc, course) => {
          const stream = course.stream || "Other";
          if (!acc[stream]) acc[stream] = [];
          acc[stream].push(course);
          return acc;
        }, {});

        // Stream colors for headers
        const streamColors = {
          "Maritime & Seamanship": [114, 52, 3],
          "Occupational Health & Safety": [220, 38, 38],
          "Port Operation & Logistics": [1, 109, 77],
          Technical: [155, 125, 254],
          "Management & IS": [1, 165, 114],
          Other: [15, 61, 145],
        };

        // Sort streams by defined order
        const sortedStreams = Object.keys(pdfGroupedCourses).sort((a, b) => {
          const indexA = streamOrder.indexOf(a);
          const indexB = streamOrder.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        sortedStreams.forEach((stream) => {
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Stream header
          const color = streamColors[stream] || streamColors["Other"];
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(14, yPosition - 5, pageWidth - 28, 10, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(stream, 20, yPosition + 2);

          yPosition += 15;

          // Table data for this stream
          const tableData = pdfGroupedCourses[stream].map((course, index) => [
            (index + 1).toString(),
            course.courseName || "N/A",
            course.duration || "N/A",
            course.fees ? `Rs. ${Number(course.fees).toLocaleString()}` : "N/A",
          ]);

          // Create table using autoTable
          autoTable(doc, {
            startY: yPosition,
            head: [["#", "Course Name", "Duration", "Fees"]],
            body: tableData,
            theme: "striped",
            headStyles: {
              fillColor: color,
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 10,
            },
            bodyStyles: {
              fontSize: 9,
              textColor: [50, 50, 50],
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            columnStyles: {
              0: { cellWidth: 12, halign: "center" },
              1: { cellWidth: "auto" },
              2: { cellWidth: 30, halign: "center" },
              3: { cellWidth: 35, halign: "right" },
            },
            margin: { left: 14, right: 14 },
            didDrawPage: function (data) {
              // Update yPosition after table is drawn
            },
          });

          // Get the final Y position after the table
          yPosition = doc.lastAutoTable
            ? doc.lastAutoTable.finalY + 15
            : yPosition + 50;
        });

        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" },
          );
        }

        // Save the PDF
        doc.save("MPMA_Course_Catalog.pdf");
        setIsGeneratingPdf(false);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF: " + error.message);
        setIsGeneratingPdf(false);
      }
    }, 100);
  };

  useEffect(() => {
    axios
      .get("http://10.70.4.34:5005/api/courses")
      .then((res) => {
        setCourses(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  // Get unique streams from courses
  const availableStreams = useMemo(() => {
    const streams = [
      ...new Set(courses.map((course) => course.stream || "Other")),
    ];
    // Sort by predefined order, put unknown streams at the end
    return streams.sort((a, b) => {
      const indexA = streamOrder.indexOf(a);
      const indexB = streamOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [courses]);

  // Group courses by stream
  const groupedCourses = useMemo(() => {
    const filtered =
      selectedStream === "All"
        ? courses
        : courses.filter(
            (course) => (course.stream || "Other") === selectedStream,
          );

    return filtered.reduce((acc, course) => {
      const stream = course.stream || "Other";
      if (!acc[stream]) acc[stream] = [];
      acc[stream].push(course);
      return acc;
    }, {});
  }, [courses, selectedStream]);

  if (loading) {
    return (
      <div className="courses-page">
        <p className="status">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <p className="status">{error}</p>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Wavy Hero Section */}
      <div className="courses-hero">
        {/* Bubble Animation */}
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        <div className="courses-hero-content">
          <h1 className="hero-title">Our Courses</h1>
          <p className="hero-subtitle">
            Explore our comprehensive range of maritime training programs
          </p>
        </div>
        <div className="wave-container">
          <svg
            className="wave"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* Stream Filter Bar */}
      <div className="stream-filter-bar">
        <div className="filter-bar-content">
          <div className="filter-buttons">
            <button
              className={`filter-btn filter-btn-all ${selectedStream === "All" ? "active" : ""}`}
              onClick={() => setSelectedStream("All")}
            >
              All Streams
            </button>
            {availableStreams.map((stream) => (
              <button
                key={stream}
                className={`filter-btn filter-btn-${streamClassMap[stream]?.replace("stream-", "") || "default"} ${selectedStream === stream ? "active" : ""}`}
                onClick={() => setSelectedStream(stream)}
              >
                {stream}
              </button>
            ))}
          </div>

          {/* Download PDF Button */}
          <button
            className="download-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf || courses.length === 0}
          >
            <span className="btn-icon">
              {isGeneratingPdf ? (
                <span className="spinner"></span>
              ) : (
                <FaFilePdf />
              )}
            </span>
            <span className="btn-text">
              {isGeneratingPdf ? "Generating..." : "Download PDF"}
            </span>
            <span className="btn-shine"></span>
          </button>
        </div>
      </div>

      {Object.keys(groupedCourses)
        .sort((a, b) => {
          const indexA = streamOrder.indexOf(a);
          const indexB = streamOrder.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        })
        .map((stream) => {
          const streamClass = streamClassMap[stream] || "stream-default";

          return (
            <section key={stream} className={`stream-section ${streamClass}`}>
              <h2 className="stream-title">{stream}</h2>

              <div className="courses-grid">
                {groupedCourses[stream].map((course) => (
                  <TiltCard
                    key={course.courseId}
                    className="course-card"
                    onClick={() => navigate(`/course/${course.courseId}`, { state: { course } })}
                  >
                    <h3 className="course-name">{course.courseName}</h3>
                    

                    <p className="course-info">
                      <strong>Duration:</strong> {course.duration}
                    </p>

                    <p className="course-info">
                      <strong>Fees:</strong> Rs. {course.fees}
                    </p>
                  </TiltCard>
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
};

export default Courses;
