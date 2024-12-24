import { useState, useEffect } from 'react';

interface Student {
  name: string;
  cohort: string;
  courses: string[];
  dateJoined: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

interface StudentTableProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
}

export function StudentTable({
  selectedClass,
  setSelectedClass,
}: StudentTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState<Student>({
    name: '',
    cohort: 'AY 2024-25',
    courses: ['', '', ''],
    dateJoined: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active',
  });

  // Fetch students based on the selected class
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // URL to fetch students filtered by class
        const url = selectedClass
          ? `http://localhost:3000/students?class=${encodeURIComponent(selectedClass)}`
          : 'http://localhost:3000/students';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [selectedClass]); // Re-fetch students whenever selectedClass changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'cohort' || name === 'status') {
      setNewStudent((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === 'course' && typeof index === 'number') {
      const updatedCourses = [...newStudent.courses];
      updatedCourses[index] = value;
      setNewStudent({ ...newStudent, courses: updatedCourses });
    }
  };

  const addCourse = () => {
    setNewStudent({ ...newStudent, courses: [...newStudent.courses, ''] });
  };

  const removeCourse = (index: number) => {
    const updatedCourses = newStudent.courses.filter((_, i) => i !== index);
    setNewStudent({ ...newStudent, courses: updatedCourses });
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        const addedStudent = await response.json();
        setShowAddForm(false); // Hide the form after adding
        setStudents((prev) => [...prev, addedStudent]); // Update the list
        setNewStudent({
          name: '',
          cohort: 'AY 2024-25',
          courses: ['', '', ''],
          dateJoined: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          status: 'active',
        });
      } else {
        console.error('Error adding student');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
            aria-label="Select Cohort"
            value={newStudent.cohort}
            onChange={handleInputChange}
            name="cohort"
          >
            <option>AY 2024-25</option>
          </select>

          <select
            id="classSelect"
            onChange={(e) => setSelectedClass(e.target.value)}
            value={selectedClass}
            className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
            aria-label="Select Class"
          >
            <option value="">Select a class</option>
            <option value="CBSE 9">CBSE 9</option>
            <option value="CBSE 10">CBSE 10</option>
            <option value="CBSE 11">CBSE 11</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)} // Toggle the form visibility
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : 'Add New Student'}
        </button>
      </div>

      {/* Add New Student Form */}
      {showAddForm && (
        <form onSubmit={addStudent} className="p-6 bg-gray-50 mt-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={newStudent.name}
              onChange={handleInputChange}
              placeholder="Student Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="cohort"
              value={newStudent.cohort}
              onChange={handleInputChange}
              placeholder="Cohort"
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div className="mb-4">
            {newStudent.courses.map((course, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  name="course"
                  value={course}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder={`Course ${index + 1}`}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeCourse(index)}
                  className="px-2 py-1 bg-red-600 text-white rounded-full"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCourse}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Add Course
            </button>
          </div>
          <div className="mb-4">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2">
              Save Student
            </button>
          </div>
        </form>
      )}

      {/* Students Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Student Name</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Cohort</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Courses</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Date Joined</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Last Login</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.cohort}</td>
                <td className="px-6 py-4">
                  {student.courses.map((course, idx) => (
                    <span key={idx} className="mr-2">{course}</span>
                  ))}
                </td>
                <td className="px-6 py-4">{student.dateJoined}</td>
                <td className="px-6 py-4">{student.lastLogin}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white ${
                      student.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No students available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
