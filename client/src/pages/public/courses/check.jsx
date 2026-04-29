import { useState, useEffect } from "react";

function Check() {
  const [courses, setCourses] = useState([]);

  // Function to fetch courses from the ERP Database
  async function fetchCourseData() {
    try {
      const response = await fetch(
        "http://10.105.17.239:5003/api/portal/courses",
        {
          method: "GET",
          headers: {
            "x-api-key": "erp_portal_secure_key_2026",
            "Content-Type": "application/json",
          },
        }
      );

     

      const result = await response.json();
     
      
        setCourses(result.data); 
      
    } catch (error) {
      console.error("Fetch Failed:", error);
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, []);

  return (
    <div>
      <h2>Course List</h2>

      {courses.length === 0 ? (
        <p>No data found</p>
      ) : (
        courses.map((item, index) => (
          <div key={index}>
            <p><strong>Course:</strong> {item.course}</p>
            <p><strong>Stream:</strong> {item.stream}</p>
            <p><strong>Medium:</strong> {item.medium}</p>
            <p><strong>Fees:</strong> {item.fees}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Check;



const arrayPerson = [{name : 'Tharusha' , age : 25}, {name : 'Kavisha ', age : 26}]


console.log(arrayPerson[0])