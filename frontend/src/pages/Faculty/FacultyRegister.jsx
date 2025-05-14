import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import image2 from "../../assets/imag35.jpeg";
import { useNavigate } from "react-router-dom";

const FacultyRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    years: [],
    subjects: {},
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const yearOptions = ["E1", "E2", "E3", "E4"];

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setIsRegistered(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleYearChange = (e) => {
    const { value, checked } = e.target;
    let newYears = [...formData.years];
    let newSubjects = { ...formData.subjects };

    if (checked) {
      newYears.push(value);
      newSubjects[value] = [""];
    } else {
      newYears = newYears.filter((year) => year !== value);
      delete newSubjects[value];
    }

    setFormData({ ...formData, years: newYears, subjects: newSubjects });
  };

  const handleSubjectChange = (year, index, value) => {
    const updatedSubjects = { ...formData.subjects };
    updatedSubjects[year][index] = value;
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const addSubjectField = (year) => {
    const updatedSubjects = { ...formData.subjects };
    updatedSubjects[year].push("");
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const removeSubjectField = (year, index) => {
    const updatedSubjects = { ...formData.subjects };
    updatedSubjects[year].splice(index, 1);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "*Name is required";
    if (!formData.email.trim()) newErrors.email = "*Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "*Email is invalid";

    if (!formData.password.trim()) newErrors.password = "*Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "*Password must be at least 6 characters";

    if (formData.years.length === 0)
      newErrors.years = "*Please select at least one year";

    const subjectErrors = {};
    formData.years.forEach((year) => {
      const subjects = formData.subjects[year] || [];
      const errors = subjects.map((subject) =>
        subject.trim() === "" ? "*Subject is required" : ""
      );
      if (errors.some((error) => error !== "")) {
        subjectErrors[year] = errors;
      }
    });

    if (!formData.contact.trim()) {
      newErrors.contact = "*Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "*Contact must be a valid 10-digit number";
    }

    if (Object.keys(subjectErrors).length > 0) {
      newErrors.subjects = subjectErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/faculty/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        console.log(formData);
        if (response.ok) {
          setIsRegistered(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            years: [],
            subjects: {},
            contact: "",
          });
          setErrors({});
          navigate("/login");
        } else {
          console.error("Failed to register the faculty");
        }
      } catch (error) {
        console.error("Error occurred while registering:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <h1 className="text-3xl font-bold text-sky-500 mb-4">Welcome</h1>
        <img src={image2} alt="Signup Visual" className="h-40 w-auto mb-4" />
        <p className="text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 bg-sky-500 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-sky-500 mb-4 text-center">
            Faculty Registration
          </h2>

          {isRegistered && (
            <div className="text-green-600 text-sm font-medium text-center bg-green-100 p-2 rounded mb-4">
              Successfully Registered!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-black">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                autoComplete="new-password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            <div>
              <label className="block mb-1 font-medium">Years Handling</label>
              <div className="grid grid-cols-2 gap-2">
                {yearOptions.map((year) => (
                  <label key={year} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={year}
                      checked={formData.years.includes(year)}
                      onChange={handleYearChange}
                    />
                    <span>{year}</span>
                  </label>
                ))}
              </div>
              {errors.years && (
                <p className="text-red-500 text-xs">{errors.years}</p>
              )}
            </div>

            {formData.years.map((year) => (
              <div key={year} className="mt-4">
                <label className="font-medium">Subjects for {year}:</label>
                {formData.subjects[year].map((subject, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) =>
                        handleSubjectChange(year, index, e.target.value)
                      }
                      placeholder={`Subject ${index + 1}`}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubjectField(year, index)}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSubjectField(year)}
                  className="text-blue-500 mt-2"
                >
                  Add Subject
                </button>
              </div>
            ))}

            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-4"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs">{errors.contact}</p>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 text-white p-2 rounded mt-4"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegister;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import image2 from "../../assets/imag35.jpeg";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const FacultyRegister = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact: "",
//     selectedYears: {},
//     selectedSemesters: {},
//     selectedSubjects: {}
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [subjectsData, setSubjectsData] = useState([]);

//   const yearOptions = ["E1", "E2", "E3", "E4"];
//   const semesterOptions = ["sem1", "sem2"];

//   // Fetch all subjects data on component mount
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/subjects");
//         console.log("Fetched subjects data:", response.data);
//         setSubjectsData(response.data);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     if (isRegistered) {
//       const timer = setTimeout(() => {
//         setIsRegistered(false);
//         navigate("/login");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [isRegistered, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleYearChange = (year) => {
//     const newSelectedYears = { ...formData.selectedYears };
//     newSelectedYears[year] = !newSelectedYears[year];
    
//     // If year is being unchecked, remove its semesters and subjects
//     if (!newSelectedYears[year]) {
//       const newSelectedSemesters = { ...formData.selectedSemesters };
//       const newSelectedSubjects = { ...formData.selectedSubjects };
      
//       delete newSelectedSemesters[year];
//       delete newSelectedSubjects[year];
      
//       setFormData({
//         ...formData,
//         selectedYears: newSelectedYears,
//         selectedSemesters: newSelectedSemesters,
//         selectedSubjects: newSelectedSubjects
//       });
//     } else {
//       setFormData({
//         ...formData,
//         selectedYears: newSelectedYears
//       });
//     }
//   };

//   const handleSemesterChange = (year, semester) => {
//     const newSelectedSemesters = { ...formData.selectedSemesters };
//     if (!newSelectedSemesters[year]) {
//       newSelectedSemesters[year] = {};
//     }
//     newSelectedSemesters[year][semester] = !newSelectedSemesters[year][semester];
    
//     // If semester is being unchecked, remove its subjects
//     if (!newSelectedSemesters[year][semester]) {
//       const newSelectedSubjects = { ...formData.selectedSubjects };
//       if (newSelectedSubjects[year]) {
//         delete newSelectedSubjects[year][semester];
//       }
//       setFormData({
//         ...formData,
//         selectedSemesters: newSelectedSemesters,
//         selectedSubjects: newSelectedSubjects
//       });
//     } else {
//       setFormData({
//         ...formData,
//         selectedSemesters: newSelectedSemesters
//       });
//     }
//   };

//   const handleSubjectChange = (year, semester, subjectCode) => {
//     const newSelectedSubjects = { ...formData.selectedSubjects };
    
//     if (!newSelectedSubjects[year]) {
//       newSelectedSubjects[year] = {};
//     }
//     if (!newSelectedSubjects[year][semester]) {
//       newSelectedSubjects[year][semester] = [];
//     }
    
//     const subjectIndex = newSelectedSubjects[year][semester].indexOf(subjectCode);
//     if (subjectIndex === -1) {
//       newSelectedSubjects[year][semester].push(subjectCode);
//     } else {
//       newSelectedSubjects[year][semester].splice(subjectIndex, 1);
//     }
    
//     setFormData({
//       ...formData,
//       selectedSubjects: newSelectedSubjects
//     });
//   };

//   const getSubjectsForYearSemester = (year, semester) => {
//     const found = subjectsData.find(
//       (item) => item.year === year && item.semester === semester
//     );
//     return found ? found.subjects : [];
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "*Name is required";
//     if (!formData.email.trim()) newErrors.email = "*Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "*Email is invalid";

//     if (!formData.password.trim()) newErrors.password = "*Password is required";
//     else if (formData.password.length < 6)
//       newErrors.password = "*Password must be at least 6 characters";

//     if (Object.keys(formData.selectedYears).filter(year => formData.selectedYears[year]).length === 0)
//       newErrors.years = "*Please select at least one year";

//     if (!formData.contact.trim()) {
//       newErrors.contact = "*Contact number is required";
//     } else if (!/^\d{10}$/.test(formData.contact)) {
//       newErrors.contact = "*Contact must be a valid 10-digit number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       setLoading(true);
//       try {
//         // Transform the selected data into the required format
//         const yearsHandling = [];
//         for (const year in formData.selectedYears) {
//           if (formData.selectedYears[year]) {
//             const yearData = {
//               year,
//               semesters: []
//             };
            
//             if (formData.selectedSemesters[year]) {
//               for (const semester in formData.selectedSemesters[year]) {
//                 if (formData.selectedSemesters[year][semester]) {
//                   const semesterData = {
//                     semester,
//                     subjects: []
//                   };
                  
//                   if (formData.selectedSubjects[year] && formData.selectedSubjects[year][semester]) {
//                     semesterData.subjects = formData.selectedSubjects[year][semester];
//                   }
                  
//                   yearData.semesters.push(semesterData);
//                 }
//               }
//             }
            
//             yearsHandling.push(yearData);
//           }
//         }

//         const payload = {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           contact: formData.contact,
//           yearsHandling
//         };

//         console.log("Submitting payload:", payload);

//         const response = await axios.post(
//           "http://localhost:4000/faculty/register",
//           payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.data.success) {
//           setIsRegistered(true);
//           setFormData({
//             name: "",
//             email: "",
//             password: "",
//             contact: "",
//             selectedYears: {},
//             selectedSemesters: {},
//             selectedSubjects: {}
//           });
//           setErrors({});
//         }
//       } catch (error) {
//         console.error("Registration error:", error);
//         setErrors({ submit: error.response?.data?.message || "Registration failed" });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-white">
//       {/* Left Section */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
//         <h1 className="text-3xl font-bold text-sky-500 mb-4">Welcome</h1>
//         <img src={image2} alt="Signup Visual" className="h-40 w-auto mb-4" />
//         <p className="text-sm">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>

//       {/* Right Section - Form */}
//       <div className="w-full md:w-1/2 bg-sky-500 flex items-center justify-center p-4">
//         <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-sky-500 mb-4 text-center">
//             Faculty Registration
//           </h2>

//           {isRegistered && (
//             <div className="text-green-600 text-sm font-medium text-center bg-green-100 p-2 rounded mb-4">
//               Successfully Registered! Redirecting to login...
//             </div>
//           )}

//           {errors.submit && (
//             <div className="text-red-500 text-sm font-medium text-center bg-red-100 p-2 rounded mb-4">
//               {errors.submit}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3 text-black">
//             {/* Name Field */}
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-xs">{errors.name}</p>
//             )}

//             {/* Email Field */}
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs">{errors.email}</p>
//             )}

//             {/* Password Field */}
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 p-2 rounded"
//                 autoComplete="new-password"
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
//               >
//                 {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
//               </span>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-xs">{errors.password}</p>
//             )}

//             {/* Contact Field */}
//             <input
//               type="text"
//               name="contact"
//               placeholder="Contact Number"
//               value={formData.contact}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded"
//             />
//             {errors.contact && (
//               <p className="text-red-500 text-xs">{errors.contact}</p>
//             )}

//             {/* Years Selection */}
//             <div className="mt-4">
//               <label className="block mb-2 font-medium">Years Handling</label>
//               {errors.years && (
//                 <p className="text-red-500 text-xs mb-2">{errors.years}</p>
//               )}
//               <div className="grid grid-cols-2 gap-2">
//                 {yearOptions.map((year) => (
//                   <label key={year} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.selectedYears[year] || false}
//                       onChange={() => handleYearChange(year)}
//                       className="form-checkbox h-4 w-4 text-sky-500"
//                     />
//                     <span>{year}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Semesters and Subjects Selection */}
//             {yearOptions.map((year) => (
//               formData.selectedYears[year] && (
//                 <div key={year} className="mt-4 p-3 bg-gray-50 rounded">
//                   <label className="block mb-2 font-medium">
//                     Semesters for {year}
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {semesterOptions.map((semester) => (
//                       <label
//                         key={`${year}-${semester}`}
//                         className="flex items-center space-x-2"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={
//                             formData.selectedSemesters[year]?.[semester] || false
//                           }
//                           onChange={() => handleSemesterChange(year, semester)}
//                           className="form-checkbox h-4 w-4 text-sky-500"
//                         />
//                         <span>{semester}</span>
//                       </label>
//                     ))}
//                   </div>

//                   {/* Subjects for each selected semester */}
//                   {semesterOptions.map((semester) => (
//                     formData.selectedSemesters[year]?.[semester] && (
//                       <div
//                         key={`${year}-${semester}-subjects`}
//                         className="mt-3 p-3 bg-gray-100 rounded"
//                       >
//                         <label className="block mb-2 font-medium">
//                           Subjects for {year} - {semester}
//                         </label>
//                         <div className="space-y-2">
//                           {getSubjectsForYearSemester(year, semester).map((subject) => (
//                             <label
//                               key={`${year}-${semester}-${subject.code}`}
//                               className="flex items-center space-x-2"
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={
//                                   formData.selectedSubjects[year]?.[semester]?.includes(subject.code) || false
//                                 }
//                                 onChange={() =>
//                                   handleSubjectChange(year, semester, subject.code)
//                                 }
//                                 className="form-checkbox h-4 w-4 text-sky-500"
//                               />
//                               <span>
//                                 {subject.code} - {subject.name}
//                               </span>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     )
//                   ))}
//                 </div>
//               )
//             ))}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-sky-500 text-white p-2 rounded mt-4 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FacultyRegister;
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import image2 from "../../assets/imag35.jpeg";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const FacultyRegister = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact: "",
//     selectedYears: {},
//     selectedSemesters: {},
//     selectedSubjects: {}
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [subjectsData, setSubjectsData] = useState([]);

//   const yearOptions = ["E1", "E2", "E3", "E4"];
//   const semesterOptions = ["sem1", "sem2"];

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/subjects");
//         setSubjectsData(response.data);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     if (isRegistered) {
//       const timer = setTimeout(() => {
//         setIsRegistered(false);
//         navigate("/login");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [isRegistered, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleYearChange = (year) => {
//     const newSelectedYears = { ...formData.selectedYears };
//     newSelectedYears[year] = !newSelectedYears[year];
    
//     let newSelectedSemesters = { ...formData.selectedSemesters };
//     let newSelectedSubjects = { ...formData.selectedSubjects };
    
//     if (!newSelectedYears[year]) {
//       delete newSelectedSemesters[year];
//       delete newSelectedSubjects[year];
//     }
    
//     setFormData({
//       ...formData,
//       selectedYears: newSelectedYears,
//       selectedSemesters: newSelectedSemesters,
//       selectedSubjects: newSelectedSubjects
//     });
    
//     // Clear years error when a year is selected
//     if (errors.years && Object.values(newSelectedYears).some(v => v)) {
//       setErrors(prev => ({ ...prev, years: "" }));
//     }
//   };

//   const handleSemesterChange = (year, semester) => {
//     const newSelectedSemesters = { ...formData.selectedSemesters };
//     if (!newSelectedSemesters[year]) {
//       newSelectedSemesters[year] = {};
//     }
//     newSelectedSemesters[year][semester] = !newSelectedSemesters[year][semester];
    
//     const newSelectedSubjects = { ...formData.selectedSubjects };
//     if (!newSelectedSubjects[year]) {
//       newSelectedSubjects[year] = {};
//     }
    
//     if (!newSelectedSemesters[year][semester]) {
//       delete newSelectedSubjects[year][semester];
//     } else {
//       newSelectedSubjects[year][semester] = newSelectedSubjects[year][semester] || [];
//     }
    
//     setFormData({
//       ...formData,
//       selectedSemesters: newSelectedSemesters,
//       selectedSubjects: newSelectedSubjects
//     });
//   };

//   const handleSubjectChange = (year, semester, subjectCode) => {
//     const newSelectedSubjects = { ...formData.selectedSubjects };
    
//     if (!newSelectedSubjects[year]) {
//       newSelectedSubjects[year] = {};
//     }
//     if (!newSelectedSubjects[year][semester]) {
//       newSelectedSubjects[year][semester] = [];
//     }
    
//     const subjectIndex = newSelectedSubjects[year][semester].indexOf(subjectCode);
//     if (subjectIndex === -1) {
//       newSelectedSubjects[year][semester].push(subjectCode);
//     } else {
//       newSelectedSubjects[year][semester].splice(subjectIndex, 1);
//     }
    
//     setFormData({
//       ...formData,
//       selectedSubjects: newSelectedSubjects
//     });
//   };

//   const getSubjectsForYearSemester = (year, semester) => {
//     const found = subjectsData.find(
//       (item) => item.year === year && item.semester === semester
//     );
//     return found ? found.subjects : [];
//   };
//   const validate = () => {
//     const newErrors = {};
    
//     // Basic field validation
//     if (!formData.name.trim()) newErrors.name = "*Name is required";
//     if (!formData.email.trim()) newErrors.email = "*Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "*Email is invalid";
//     if (!formData.password.trim()) newErrors.password = "*Password is required";
//     else if (formData.password.length < 6)
//       newErrors.password = "*Password must be at least 6 characters";
//     if (!formData.contact.trim()) {
//       newErrors.contact = "*Contact number is required";
//     } else if (!/^\d{10}$/.test(formData.contact)) {
//       newErrors.contact = "*Contact must be a valid 10-digit number";
//     }
    
//     // Years validation
//     const hasSelectedYears = Object.values(formData.selectedYears).some(v => v);
//     if (!hasSelectedYears) {
//       newErrors.years = "*Please select at least one year";
//     } else {
//       // Validate that at least one subject is selected for each selected semester
//       for (const year in formData.selectedYears) {
//         if (formData.selectedYears[year]) {
//           const semesters = formData.selectedSemesters[year] || {};
//           for (const semester in semesters) {
//             if (semesters[semester]) {
//               const subjects = formData.selectedSubjects[year]?.[semester] || [];
//               if (subjects.length === 0) {
//                 newErrors.subjects = "*Please select at least one subject for each selected semester";
//                 break;
//               }
//             }
//           }
//         }
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (validate()) {
//   //     setLoading(true);
//   //     try {
//   //       const yearsHandling = [];
//   //       for (const year in formData.selectedYears) {
//   //         if (formData.selectedYears[year]) {
//   //           const yearData = {
//   //             year,
//   //             semesters: []
//   //           };
            
//   //           if (formData.selectedSemesters[year]) {
//   //             for (const semester in formData.selectedSemesters[year]) {
//   //               if (formData.selectedSemesters[year][semester]) {
//   //                 const semesterData = {
//   //                   semester,
//   //                   subjects: formData.selectedSubjects[year]?.[semester] || []
//   //                 };
//   //                 yearData.semesters.push(semesterData);
//   //               }
//   //             }
//   //           }
            
//   //           yearsHandling.push(yearData);
//   //         }
//   //       }

//   //       const payload = {
//   //         name: formData.name,
//   //         email: formData.email,
//   //         password: formData.password,
//   //         contact: formData.contact,
//   //         yearsHandling
//   //       };

//   //       const response = await axios.post(
//   //         "http://localhost:4000/faculty/register",
//   //         payload,
//   //         {
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //         }
//   //       );

//   //       if (response.data.success) {
//   //         setIsRegistered(true);
//   //         setFormData({
//   //           name: "",
//   //           email: "",
//   //           password: "",
//   //           contact: "",
//   //           selectedYears: {},
//   //           selectedSemesters: {},
//   //           selectedSubjects: {}
//   //         });
//   //         setErrors({});
//   //       }
//   //     } catch (error) {
//   //       console.error("Registration error:", error);
//   //       setErrors({ submit: error.response?.data?.message || "Registration failed" });
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (validate()) {
//       setLoading(true);
//       try {
//         // Transform data to match backend expectations
//         const payload = {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           contact: formData.contact,
//           years: Object.keys(formData.selectedYears).filter(year => formData.selectedYears[year]),
//           subjects: formData.selectedSubjects
//         };
  
//         console.log("Final payload:", JSON.stringify(payload, null, 2));
  
//         const response = await axios.post(
//           "http://localhost:4000/faculty/register",
//           payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
  
//         if (response.data.success) {
//           setIsRegistered(true);
//           // Reset form
//           setFormData({
//             name: "",
//             email: "",
//             password: "",
//             contact: "",
//             selectedYears: {},
//             selectedSemesters: {},
//             selectedSubjects: {}
//           });
//           setErrors({});
//         }
//       } catch (error) {
//         console.error("Registration error:", error);
//         // Show more detailed error message
//         setErrors({ 
//           submit: error.response?.data?.message || 
//                  error.response?.data?.error || 
//                  "Registration failed. Please check your inputs."
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-white">
//       {/* Left Section */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
//         <h1 className="text-3xl font-bold text-sky-500 mb-4">Welcome</h1>
//         <img src={image2} alt="Signup Visual" className="h-40 w-auto mb-4" />
//         <p className="text-sm">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>

//       {/* Right Section - Form */}
//       <div className="w-full md:w-1/2 bg-sky-500 flex items-center justify-center p-4">
//         <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-sky-500 mb-4 text-center">
//             Faculty Registration
//           </h2>

//           {isRegistered && (
//             <div className="text-green-600 text-sm font-medium text-center bg-green-100 p-2 rounded mb-4">
//               Successfully Registered! Redirecting to login...
//             </div>
//           )}

//           {errors.submit && (
//             <div className="text-red-500 text-sm font-medium text-center bg-red-100 p-2 rounded mb-4">
//               {errors.submit}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3 text-black">
//             {/* Name Field */}
//             <div>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 p-2 rounded"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-xs">{errors.name}</p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 p-2 rounded"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 p-2 rounded"
//                   autoComplete="new-password"
//                 />
//                 <span
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
//                 >
//                   {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
//                 </span>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-xs">{errors.password}</p>
//               )}
//             </div>

//             {/* Contact Field */}
//             <div>
//               <input
//                 type="text"
//                 name="contact"
//                 placeholder="Contact Number"
//                 value={formData.contact}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 p-2 rounded"
//               />
//               {errors.contact && (
//                 <p className="text-red-500 text-xs">{errors.contact}</p>
//               )}
//             </div>

//             {/* Years Selection */}
//             <div className="mt-4">
//               <label className="block mb-2 font-medium">Years Handling</label>
//               {errors.years && (
//                 <p className="text-red-500 text-xs mb-2">{errors.years}</p>
//               )}
//               <div className="grid grid-cols-2 gap-2">
//                 {yearOptions.map((year) => (
//                   <label key={year} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={!!formData.selectedYears[year]}
//                       onChange={() => handleYearChange(year)}
//                       className="form-checkbox h-4 w-4 text-sky-500"
//                     />
//                     <span>{year}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Semesters and Subjects Selection */}
//             {yearOptions.map((year) => (
//               formData.selectedYears[year] && (
//                 <div key={year} className="mt-4 p-3 bg-gray-50 rounded">
//                   <label className="block mb-2 font-medium">
//                     Semesters for {year}
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {semesterOptions.map((semester) => (
//                       <label
//                         key={`${year}-${semester}`}
//                         className="flex items-center space-x-2"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={!!formData.selectedSemesters[year]?.[semester]}
//                           onChange={() => handleSemesterChange(year, semester)}
//                           className="form-checkbox h-4 w-4 text-sky-500"
//                         />
//                         <span>{semester}</span>
//                       </label>
//                     ))}
//                   </div>

//                   {/* Subjects for each selected semester */}
//                   {semesterOptions.map((semester) => (
//                     formData.selectedSemesters[year]?.[semester] && (
//                       <div
//                         key={`${year}-${semester}-subjects`}
//                         className="mt-3 p-3 bg-gray-100 rounded"
//                       >
//                         <label className="block mb-2 font-medium">
//                           Subjects for {year} - {semester}
//                         </label>
//                         {errors.subjects && (
//                           <p className="text-red-500 text-xs mb-2">{errors.subjects}</p>
//                         )}
//                         <div className="space-y-2">
//                           {getSubjectsForYearSemester(year, semester).map((subject) => (
//                             <label
//                               key={`${year}-${semester}-${subject.code}`}
//                               className="flex items-center space-x-2"
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={
//                                   formData.selectedSubjects[year]?.[semester]?.includes(subject.code) || false
//                                 }
//                                 onChange={() =>
//                                   handleSubjectChange(year, semester, subject.code)
//                                 }
//                                 className="form-checkbox h-4 w-4 text-sky-500"
//                               />
//                               <span>
//                                 {subject.code} - {subject.name}
//                               </span>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     )
//                   ))}
//                 </div>
//               )
//             ))}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-sky-500 text-white p-2 rounded mt-4 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FacultyRegister;

