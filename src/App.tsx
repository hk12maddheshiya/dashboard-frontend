import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StudentTable } from './components/StudentTable';

const user = {
  name: 'Adeline H. Dancy',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
};

function App() {
  const [students, setStudents] = useState([]); // State to store students
  const [selectedClass, setSelectedClass] = useState(''); // State to store selected class
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentClass: '',
    cohort: 'AY 2024-25', // Default cohort
    courses: [''], // Initial empty course field
    lastLogin: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    status: 'active', // Default status set to active
  }); // State to handle the new student form data
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle the visibility of the Add Student form

  // Fetch data based on the selected class
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const backendUrl = 'http://localhost:3000/students'; // Your deployed backend URL
        const url = selectedClass
          ? `${backendUrl}?class=${encodeURIComponent(selectedClass)}`
          : `${backendUrl}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        setStudents(data); // Update students state
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    if (selectedClass) {
      fetchStudentData();
    }
  }, [selectedClass]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'studentClass' || name === 'cohort' || name === 'status') {
      setNewStudent((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (name === 'course' && typeof index === 'number') {
      const updatedCourses = [...newStudent.courses];
      updatedCourses[index] = value;
      setNewStudent((prevState) => ({
        ...prevState,
        courses: updatedCourses,
      }));
    }
  };

  // Add new course field
  const addCourse = () => {
    setNewStudent((prevState) => ({
      ...prevState,
      courses: [...prevState.courses, ''],
    }));
  };

  // Remove course field
  const removeCourse = (index: number) => {
    const updatedCourses = newStudent.courses.filter((_, i) => i !== index);
    setNewStudent((prevState) => ({
      ...prevState,
      courses: updatedCourses,
    }));
  };

  // Handle the form submission to add a new student
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudent,
          lastLogin: new Date().toISOString().split('T')[0], // Set current date
          status: 'active', // Set status as active
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      const addedStudent = await response.json();
      setStudents((prevStudents) => [...prevStudents, addedStudent]); // Add the new student to the state
      setNewStudent({
        name: '',
        studentClass: '',
        cohort: 'AY 2024-25',
        courses: [''],
        lastLogin: new Date().toISOString().split('T')[0], // Set current date again for next form entry
        status: 'active',
      }); // Reset the form
      setShowAddForm(false); // Hide the form after saving
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              {/* Removed the Select Class dropdown here */}
            </div>

            {/* Button to toggle the Add New Student form */}
            <StudentTable
              students={students}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
            />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
