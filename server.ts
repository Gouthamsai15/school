import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Storage
  const db = {
    students: [
      { id: "1", name: "John Doe", classId: "1", rollNo: "101" },
      { id: "2", name: "Jane Smith", classId: "2", rollNo: "202" }
    ],
    staff: [
      { id: "1", name: "Mr. Sharma", role: "Teaching Staff" },
      { id: "2", name: "Ms. Gupta", role: "Non-Teaching Staff", department: "Admin" }
    ],
    fees: [
      { id: "1", studentId: "1", amount: 5000, status: "Paid", date: "2026-03-01" },
      { id: "2", studentId: "2", amount: 4500, status: "Pending", date: "2026-03-05" }
    ],
    transport: [
      { id: "1", vehicleNo: "DL-01-AB-1234", route: "Route 1", driver: "Ramesh" },
      { id: "2", vehicleNo: "DL-02-CD-5678", route: "Route 2", driver: "Suresh" }
    ],
    admissions: [
      { id: "1", applicantName: "Alice Brown", grade: "1st", status: "Pending" },
      { id: "2", applicantName: "Bob White", grade: "5th", status: "Approved" }
    ],
    attendance: [
      { id: "1", studentId: "1", date: "2026-03-18", status: "Present", subjectId: "1", time: "09:00" },
      { id: "2", studentId: "1", date: "2026-03-19", status: "Present", subjectId: "1", time: "09:00" },
      { id: "3", studentId: "2", date: "2026-03-18", status: "Absent", subjectId: "3", time: "09:00" },
      { id: "4", studentId: "2", date: "2026-03-19", status: "Present", subjectId: "3", time: "09:00" },
    ],
    exams: [
      { id: "1", studentId: "1", subjectId: "1", marks: 85, totalMarks: 100, examName: "Midterm" },
      { id: "2", studentId: "1", subjectId: "2", marks: 78, totalMarks: 100, examName: "Midterm" },
      { id: "3", studentId: "2", subjectId: "3", marks: 92, totalMarks: 100, examName: "Midterm" },
    ],
    leaves: [
      { id: "1", staffId: "1", startDate: "2026-03-20", endDate: "2026-03-22", reason: "Personal", status: "Pending" },
      { id: "2", staffId: "2", startDate: "2026-03-25", endDate: "2026-03-26", reason: "Sick Leave", status: "Approved" }
    ],
    tasks: [
      { id: "1", staffId: "2", title: "Clean Lab", description: "Deep clean the chemistry lab", dueDate: "2026-03-20", status: "Pending" },
      { id: "2", staffId: "2", title: "Inventory Check", description: "Check office supplies", dueDate: "2026-03-22", status: "Completed" }
    ],
    timetable: [
      { id: "1", classId: "1", subjectId: "1", teacherId: "1", day: "Monday", startTime: "09:00", endTime: "10:00" },
      { id: "2", classId: "1", subjectId: "2", teacherId: "1", day: "Monday", startTime: "10:00", endTime: "11:00" },
      { id: "3", classId: "2", subjectId: "3", teacherId: "1", day: "Tuesday", startTime: "09:00", endTime: "10:00" }
    ],
    classes: [
      { id: "1", name: "10th", section: "A" },
      { id: "2", name: "9th", section: "B" }
    ],
    subjects: [
      { id: "1", name: "Mathematics" },
      { id: "2", name: "Physics" },
      { id: "3", name: "English" }
    ],
    classSubjects: [
      { id: "1", classId: "1", subjectId: "1", teacherId: "1" },
      { id: "2", classId: "1", subjectId: "2", teacherId: "1" },
      { id: "3", classId: "2", subjectId: "3", teacherId: "1" }
    ],
    documents: [
      { id: "1", userId: "1", userRole: "Student", fileName: "Report_Card.pdf", fileType: "application/pdf", uploadDate: "2026-03-10", filePath: "/uploads/1710840000000-Report_Card.pdf" },
      { id: "2", userId: "1", userRole: "Teaching Staff", fileName: "Lesson_Plan.pdf", fileType: "application/pdf", uploadDate: "2026-03-12", filePath: "/uploads/1710840000001-Lesson_Plan.pdf" }
    ],
    settings: {
      schoolName: "INDDIA International School",
      academicYear: "2025-26",
      roles: ["Admin", "Teaching Staff", "Non-Teaching Staff", "Student", "Parent", "HR", "Accounts", "Transport", "Admission"],
      systemConfig: {
        allowRegistration: true,
        maintenanceMode: false,
        theme: "indigo"
      }
    }
  };

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password, role } = req.body;
    console.log(`Login attempt: ${username} as ${role}`);
    // Simple mock login
    if (username === "admin" && password === "admin" && role === "Admin") {
      res.json({ success: true, user: { id: "admin", username, role } });
    } else if (username === "teacher" && password === "teacher" && role === "Teaching Staff") {
      res.json({ success: true, user: { id: "teacher1", username, role, staffId: "1" } });
    } else if (username === "student1" && password === "student1" && role === "Student") {
      res.json({ success: true, user: { id: "student1", username, role, studentId: "1" } });
    } else if (username === "parent1" && password === "parent1" && role === "Parent") {
      res.json({ success: true, user: { id: "parent1", username, role, studentId: "1" } });
    } else if (username === "hr" && password === "hr" && role === "HR") {
      res.json({ success: true, user: { id: "hr1", username, role } });
    } else if (username === "staff2" && password === "staff2" && role === "Non-Teaching Staff") {
      res.json({ success: true, user: { id: "staff2", username, role, staffId: "2" } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Pagination helper
  const paginate = (data: any[], page: number = 1, limit: number = 10) => {
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);
    return {
      data: paginatedData,
      total,
      page,
      totalPages
    };
  };

  // Students API
  app.get("/api/students", (req, res) => {
    const { id, classId, search, page, limit = 10 } = req.query;
    let results = db.students.map(s => {
      const cls = db.classes.find(c => c.id === s.classId);
      return { ...s, classInfo: cls };
    });

    if (id) {
      results = results.filter(s => s.id === id);
    }
    if (classId) {
      results = results.filter(s => s.classId === classId);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q))
      );
    }
    if (page) {
      res.json(paginate(results, Number(page), Number(limit)));
    } else {
      res.json(results);
    }
  });
  app.post("/api/students", (req, res) => {
    const newStudent = { id: Date.now().toString(), ...req.body };
    db.students.push(newStudent);
    res.json({ success: true, student: newStudent });
  });
  app.put("/api/students/:id", (req, res) => {
    const index = db.students.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.students[index] = { ...db.students[index], ...req.body };
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });
  app.delete("/api/students/:id", (req, res) => {
    const index = db.students.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.students.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Staff API
  app.get("/api/staff", (req, res) => {
    const { search, role, page, limit = 10 } = req.query;
    let results = db.staff.map(s => {
      const assignments = db.classSubjects.filter(cs => cs.teacherId === s.id).map(cs => {
        const cls = db.classes.find(c => c.id === cs.classId);
        const subject = db.subjects.find(sub => sub.id === cs.subjectId);
        return { class: cls, subject: subject };
      });
      return { ...s, assignments };
    });

    if (role) {
      results = results.filter(s => s.role === role);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.email && s.email.toLowerCase().includes(q))
      );
    }
    if (page) {
      res.json(paginate(results, Number(page), Number(limit)));
    } else {
      res.json(results);
    }
  });
  app.post("/api/staff", (req, res) => {
    const newStaff = { id: Date.now().toString(), ...req.body };
    db.staff.push(newStaff);
    res.json({ success: true, staff: newStaff });
  });
  app.put("/api/staff/:id", (req, res) => {
    const index = db.staff.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.staff[index] = { ...db.staff[index], ...req.body };
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });
  app.delete("/api/staff/:id", (req, res) => {
    const index = db.staff.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.staff.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Fees API
  app.get("/api/fees", (req, res) => {
    const { studentId, search, page = 1, limit = 10 } = req.query;
    let results = db.fees.map(f => {
      const student = db.students.find(s => s.id === f.studentId);
      return { ...f, studentInfo: student };
    });
    if (studentId) {
      results = results.filter(f => f.studentId === studentId);
    }
    if (search) {
      const s = String(search).toLowerCase();
      results = results.filter(f => f.studentId.toLowerCase().includes(s) || (f.studentInfo && f.studentInfo.name.toLowerCase().includes(s)));
    }
    const total = results.length;
    const p = Number(page);
    const l = Number(limit);
    const data = results.slice((p - 1) * l, p * l);
    res.json({ data, total, page: p, totalPages: Math.ceil(total / l) });
  });
  app.post("/api/fees", (req, res) => {
    const newFee = { id: Date.now().toString(), ...req.body };
    db.fees.push(newFee);
    res.json({ success: true, fee: newFee });
  });
  app.delete("/api/fees/:id", (req, res) => {
    const index = db.fees.findIndex(f => f.id === req.params.id);
    if (index !== -1) {
      db.fees.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Transport API
  app.get("/api/transport", (req, res) => {
    const { search, page, limit = 10 } = req.query;
    let filtered = db.transport;
    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(v => 
        v.vehicleNo.toLowerCase().includes(s) || 
        v.route.toLowerCase().includes(s) || 
        v.driver.toLowerCase().includes(s)
      );
    }
    if (page) {
      const total = filtered.length;
      const p = Number(page);
      const l = Number(limit);
      const data = filtered.slice((p - 1) * l, p * l);
      res.json({ data, total, page: p, totalPages: Math.ceil(total / l) });
    } else {
      res.json(filtered);
    }
  });
  app.post("/api/transport", (req, res) => {
    const newVehicle = { id: Date.now().toString(), ...req.body };
    db.transport.push(newVehicle);
    res.json({ success: true, vehicle: newVehicle });
  });
  app.delete("/api/transport/:id", (req, res) => {
    const index = db.transport.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
      db.transport.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Admissions API
  app.get("/api/admissions", (req, res) => {
    const { search, page, limit = 10 } = req.query;
    let filtered = db.admissions;
    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(a => a.applicantName.toLowerCase().includes(s) || a.grade.toLowerCase().includes(s));
    }
    if (page) {
      const total = filtered.length;
      const p = Number(page);
      const l = Number(limit);
      const data = filtered.slice((p - 1) * l, p * l);
      res.json({ data, total, page: p, totalPages: Math.ceil(total / l) });
    } else {
      res.json(filtered);
    }
  });
  app.post("/api/admissions", (req, res) => {
    const newAdm = { id: Date.now().toString(), ...req.body };
    db.admissions.push(newAdm);
    res.json({ success: true, admission: newAdm });
  });

  // Leaves API
  app.get("/api/leaves", (req, res) => {
    const { staffId, search, page, limit = 10 } = req.query;
    let results = db.leaves.map(l => {
      const staff = db.staff.find(s => s.id === l.staffId);
      return { ...l, staffInfo: staff };
    });
    if (staffId) {
      results = results.filter(l => l.staffId === staffId);
    }
    if (search) {
      const s = String(search).toLowerCase();
      results = results.filter(l => l.reason.toLowerCase().includes(s) || (l.staffInfo && l.staffInfo.name.toLowerCase().includes(s)));
    }
    if (page) {
      const total = results.length;
      const p = Number(page);
      const l = Number(limit);
      const data = results.slice((p - 1) * l, p * l);
      res.json({ data, total, page: p, totalPages: Math.ceil(total / l) });
    } else {
      res.json(results);
    }
  });
  app.post("/api/leaves", (req, res) => {
    const newLeave = { id: Date.now().toString(), status: "Pending", ...req.body };
    db.leaves.push(newLeave);
    res.json({ success: true, leave: newLeave });
  });
  app.patch("/api/leaves/:id", (req, res) => {
    const leave = db.leaves.find(l => l.id === req.params.id);
    if (leave) {
      Object.assign(leave, req.body);
      res.json({ success: true, leave });
    } else res.status(404).json({ success: false });
  });

  // Tasks API
  app.get("/api/tasks", (req, res) => {
    const { staffId, search, page, limit = 10 } = req.query;
    let results = db.tasks.map(t => {
      const staff = db.staff.find(s => s.id === t.staffId);
      return { ...t, staffInfo: staff };
    });
    if (staffId) {
      results = results.filter(t => t.staffId === staffId);
    }
    if (search) {
      const s = String(search).toLowerCase();
      results = results.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s) || (t.staffInfo && t.staffInfo.name.toLowerCase().includes(s)));
    }
    if (page) {
      const total = results.length;
      const p = Number(page);
      const l = Number(limit);
      const data = results.slice((p - 1) * l, p * l);
      res.json({ data, total, page: p, totalPages: Math.ceil(total / l) });
    } else {
      res.json(results);
    }
  });
  app.post("/api/tasks", (req, res) => {
    const newTask = { id: Date.now().toString(), status: "Pending", ...req.body };
    db.tasks.push(newTask);
    res.json({ success: true, task: newTask });
  });
  app.patch("/api/tasks/:id", (req, res) => {
    const task = db.tasks.find(t => t.id === req.params.id);
    if (task) {
      Object.assign(task, req.body);
      res.json({ success: true, task });
    } else res.status(404).json({ success: false });
  });
  app.put("/api/admissions/:id", (req, res) => {
    const index = db.admissions.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
      db.admissions[index] = { ...db.admissions[index], ...req.body };
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });
  app.delete("/api/admissions/:id", (req, res) => {
    const index = db.admissions.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
      db.admissions.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Attendance API
  app.get("/api/attendance", (req, res) => {
    const { date, studentId, subjectId, page, limit = 10 } = req.query;
    let results = db.attendance.map(a => {
      const student = db.students.find(s => s.id === a.studentId);
      const subject = db.subjects.find(s => s.id === a.subjectId);
      return { 
        ...a, 
        studentInfo: student ? { ...student, classInfo: db.classes.find(c => c.id === student.classId) } : null,
        subjectInfo: subject 
      };
    });
    if (date) {
      results = results.filter(a => a.date === date);
    }
    if (studentId) {
      results = results.filter(a => a.studentId === studentId);
    }
    if (subjectId) {
      results = results.filter(a => a.subjectId === subjectId);
    }
    if (page) {
      res.json(paginate(results, Number(page), Number(limit)));
    } else {
      res.json(results);
    }
  });
  app.post("/api/attendance", (req, res) => {
    const { studentId, status, date, subjectId, time } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Upsert logic based on student, date, and subject
    const index = db.attendance.findIndex(a => 
      a.studentId === studentId && 
      a.date === targetDate && 
      a.subjectId === subjectId
    );
    
    if (index !== -1) {
      db.attendance[index].status = status;
      db.attendance[index].time = time || db.attendance[index].time;
      res.json({ success: true, record: db.attendance[index], updated: true });
    } else {
      const record = { 
        id: Date.now().toString(), 
        studentId, 
        status, 
        date: targetDate, 
        subjectId, 
        time: time || '09:00 AM' 
      };
      db.attendance.push(record);
      res.json({ success: true, record, updated: false });
    }
  });

  // Exams API
  app.get("/api/exams", (req, res) => {
    const { studentId, examName, subjectId, page, limit = 10 } = req.query;
    let results = db.exams.map(e => {
      const student = db.students.find(s => s.id === e.studentId);
      const subject = db.subjects.find(s => s.id === e.subjectId);
      return { 
        ...e, 
        studentInfo: student ? { ...student, classInfo: db.classes.find(c => c.id === student.classId) } : null,
        subjectInfo: subject 
      };
    });
    if (studentId) results = results.filter(e => e.studentId === studentId);
    if (examName) results = results.filter(e => e.examName === examName);
    if (subjectId) results = results.filter(e => e.subjectId === subjectId);
    if (page) {
      res.json(paginate(results, Number(page), Number(limit)));
    } else {
      res.json(results);
    }
  });
  app.post("/api/exams", (req, res) => {
    const { marksData } = req.body; // Expecting an array of { studentId, subjectId, marks, totalMarks, examName }
    if (Array.isArray(marksData)) {
      marksData.forEach(item => {
        const existingIndex = db.exams.findIndex(e => 
          e.studentId === item.studentId && 
          e.subjectId === item.subjectId && 
          e.examName === item.examName
        );
        if (existingIndex !== -1) {
          db.exams[existingIndex] = { ...db.exams[existingIndex], ...item };
        } else {
          db.exams.push({ id: Date.now().toString() + Math.random(), ...item });
        }
      });
      res.json({ success: true, message: "Marks saved successfully" });
    } else {
      const record = { id: Date.now().toString(), ...req.body };
      db.exams.push(record);
      res.json({ success: true, record });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", (req, res) => {
    res.json({
      totalStudents: db.students.length,
      totalStaff: db.staff.length,
      feesCollected: db.fees.filter(f => f.status === "Paid").reduce((acc, f) => acc + f.amount, 0),
      attendanceRate: "94%"
    });
  });

  // Protected Mock Routes
  const checkRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      const userRole = req.headers['x-user-role'];
      if (!userRole || !allowedRoles.includes(userRole as string)) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      next();
    };
  };

  app.post("/api/students/add", checkRole(['Admin', 'Admission']), (req, res) => {
    res.json({ success: true, message: "Student added successfully" });
  });

  app.post("/api/attendance/mark", checkRole(['Admin', 'Teaching Staff']), (req, res) => {
    res.json({ success: true, message: "Attendance marked successfully" });
  });

  // Timetable API
  app.get("/api/timetable", (req, res) => {
    const { classId, teacherId } = req.query;
    let results = db.timetable.map(t => {
      const cls = db.classes.find(c => c.id === t.classId);
      const subject = db.subjects.find(s => s.id === t.subjectId);
      const teacher = db.staff.find(s => s.id === t.teacherId);
      return { ...t, classInfo: cls, subjectInfo: subject, teacherInfo: teacher };
    });
    if (classId) results = results.filter(t => t.classId === classId);
    if (teacherId) results = results.filter(t => t.teacherId === teacherId);
    res.json(results);
  });

  app.post("/api/timetable", (req, res) => {
    const { classId, subjectId, teacherId, day, startTime, endTime } = req.body;

    if (!startTime || !endTime || startTime >= endTime) {
      return res.status(400).json({ success: false, message: "Invalid time range. Start time must be before end time." });
    }

    // Helper to check overlap
    const isOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
      return (start1 < end2 && end1 > start2);
    };

    // Check class overlap
    const classConflict = db.timetable.find(t => 
      t.classId === classId && t.day === day && isOverlapping(startTime, endTime, t.startTime, t.endTime)
    );
    if (classConflict) {
      const subject = db.subjects.find(s => s.id === classConflict.subjectId);
      return res.status(400).json({ success: false, message: `Class already has ${subject?.name || 'another subject'} at this time.` });
    }

    // Check teacher overlap
    const teacherConflict = db.timetable.find(t => 
      t.teacherId === teacherId && t.day === day && isOverlapping(startTime, endTime, t.startTime, t.endTime)
    );
    if (teacherConflict) {
      const cls = db.classes.find(c => c.id === teacherConflict.classId);
      return res.status(400).json({ success: false, message: `Teacher is already busy with Class ${cls?.name || teacherConflict.classId} at this time.` });
    }

    const newEntry = { id: Date.now().toString(), ...req.body };
    db.timetable.push(newEntry);
    res.json({ success: true, entry: newEntry });
  });

  app.put("/api/timetable/:id", (req, res) => {
    const { classId, subjectId, teacherId, day, startTime, endTime } = req.body;
    const index = db.timetable.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false });

    if (!startTime || !endTime || startTime >= endTime) {
      return res.status(400).json({ success: false, message: "Invalid time range. Start time must be before end time." });
    }

    // Helper to check overlap
    const isOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
      return (start1 < end2 && end1 > start2);
    };

    // Check class overlap (excluding current entry)
    const classConflict = db.timetable.find(t => 
      t.id !== req.params.id && t.classId === classId && t.day === day && isOverlapping(startTime, endTime, t.startTime, t.endTime)
    );
    if (classConflict) {
      const subject = db.subjects.find(s => s.id === classConflict.subjectId);
      return res.status(400).json({ success: false, message: `Class already has ${subject?.name || 'another subject'} at this time.` });
    }

    // Check teacher overlap (excluding current entry)
    const teacherConflict = db.timetable.find(t => 
      t.id !== req.params.id && t.teacherId === teacherId && t.day === day && isOverlapping(startTime, endTime, t.startTime, t.endTime)
    );
    if (teacherConflict) {
      const cls = db.classes.find(c => c.id === teacherConflict.classId);
      return res.status(400).json({ success: false, message: `Teacher is already busy with Class ${cls?.name || teacherConflict.classId} at this time.` });
    }

    db.timetable[index] = { ...db.timetable[index], ...req.body };
    res.json({ success: true, entry: db.timetable[index] });
  });

  app.delete("/api/timetable/:id", (req, res) => {
    const index = db.timetable.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      db.timetable.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Classes API
  app.get("/api/classes", (req, res) => res.json(db.classes));
  app.post("/api/classes", (req, res) => {
    const newClass = { id: Date.now().toString(), ...req.body };
    db.classes.push(newClass);
    res.json({ success: true, class: newClass });
  });
  app.put("/api/classes/:id", (req, res) => {
    const index = db.classes.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      db.classes[index] = { ...db.classes[index], ...req.body };
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });
  app.delete("/api/classes/:id", (req, res) => {
    const index = db.classes.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      db.classes.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Subjects API
  app.get("/api/subjects", (req, res) => res.json(db.subjects));
  app.post("/api/subjects", (req, res) => {
    const newSubject = { id: Date.now().toString(), ...req.body };
    db.subjects.push(newSubject);
    res.json({ success: true, subject: newSubject });
  });
  app.put("/api/subjects/:id", (req, res) => {
    const index = db.subjects.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.subjects[index] = { ...db.subjects[index], ...req.body };
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });
  app.delete("/api/subjects/:id", (req, res) => {
    const index = db.subjects.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.subjects.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Class-Subjects Mapping API
  app.get("/api/class-subjects", (req, res) => {
    const { classId, teacherId } = req.query;
    let results = db.classSubjects.map(cs => {
      const cls = db.classes.find(c => c.id === cs.classId);
      const subject = db.subjects.find(s => s.id === cs.subjectId);
      const teacher = db.staff.find(s => s.id === cs.teacherId);
      return { ...cs, classInfo: cls, subjectInfo: subject, teacherInfo: teacher };
    });
    if (classId) results = results.filter(cs => cs.classId === classId);
    if (teacherId) results = results.filter(cs => cs.teacherId === teacherId);
    res.json(results);
  });
  app.post("/api/class-subjects", (req, res) => {
    const { classId, subjectId, teacherId } = req.body;
    
    // Rule: Teacher must exist
    const teacherExists = db.staff.some(s => s.id === teacherId);
    if (!teacherExists) {
      return res.status(400).json({ success: false, message: "Teacher does not exist" });
    }

    // Rule: No duplicate mappings
    const duplicate = db.classSubjects.some(cs => cs.classId === classId && cs.subjectId === subjectId);
    if (duplicate) {
      return res.status(400).json({ success: false, message: "This subject is already mapped to this class" });
    }

    const newMapping = { id: Date.now().toString(), classId, subjectId, teacherId };
    db.classSubjects.push(newMapping);
    res.json({ success: true, mapping: newMapping });
  });
  app.delete("/api/class-subjects/:id", (req, res) => {
    const index = db.classSubjects.findIndex(cs => cs.id === req.params.id);
    if (index !== -1) {
      db.classSubjects.splice(index, 1);
      res.json({ success: true });
    } else res.status(404).json({ success: false });
  });

  // Document Management API
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only PDF, JPEG, PNG, and DOCX are allowed."));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  app.get("/api/documents", (req, res) => {
    const { userId, userRole, targetUserId, targetUserRole, studentId, search, page = 1, limit = 10 } = req.query;
    let filtered = db.documents;

    // If targetUserId is provided, filter by it (Admin/HR only or self)
    if (targetUserId) {
      if (userRole === "Admin" || userRole === "HR" || userId === targetUserId || userRole === "Teaching Staff") {
        filtered = db.documents.filter(d => d.userId === targetUserId);
        if (targetUserRole) {
          filtered = filtered.filter(d => d.userRole === targetUserRole);
        }
      } else {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
    } else if (userRole === "Admin") {
      // Admin sees all
    } else if (userRole === "HR") {
      // HR sees staff documents
      filtered = filtered.filter(doc => doc.userRole === "Teaching Staff" || doc.userRole === "Non-Teaching Staff" || doc.userRole === "HR");
    } else if (userRole === "Teaching Staff") {
      // Teachers see their own and all students' documents
      filtered = filtered.filter(doc => (doc.userId === userId && doc.userRole === userRole) || doc.userRole === "Student");
    } else if (userRole === "Parent" && studentId) {
      // Parents see their own and their child's documents
      filtered = filtered.filter(doc => (doc.userId === userId && doc.userRole === userRole) || (doc.userId === studentId && doc.userRole === "Student"));
    } else if (userId && userRole) {
      // Others see their own
      filtered = filtered.filter(doc => doc.userId === userId && doc.userRole === userRole);
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q));
    }

    res.json(paginate(filtered, Number(page), Number(limit)));
  });

  app.post("/api/documents", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    
    const { userId, userRole } = req.body;
    const newDoc = {
      id: Date.now().toString(),
      userId,
      userRole,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      uploadDate: new Date().toISOString().split("T")[0],
      filePath: `/uploads/${req.file.filename}`
    };
    db.documents.push(newDoc);
    res.json({ success: true, document: newDoc });
  });

  app.delete("/api/documents/:id", (req, res) => {
    const { userId, userRole } = req.query;
    const index = db.documents.findIndex(doc => doc.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false });

    const doc = db.documents[index];
    if (userRole === "Admin" || doc.userId === userId) {
      // Delete file from disk
      const filePath = path.join(process.cwd(), doc.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      db.documents.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(403).json({ success: false, message: "Unauthorized to delete this document" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // Reports API
  app.get("/api/reports", (req, res) => {
    const { role, userId, studentId } = req.query;

    if (role === "Admin") {
      const totalFees = db.fees.reduce((sum, f) => sum + f.amount, 0);
      const paidFees = db.fees.filter(f => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0);
      const pendingFees = totalFees - paidFees;
      const attendanceRate = (db.attendance.filter(a => a.status === "Present").length / db.attendance.length) * 100 || 0;
      const avgPerformance = db.exams.reduce((sum, e) => sum + (e.marks / e.totalMarks) * 100, 0) / db.exams.length || 0;

      return res.json({
        fees: { total: totalFees, paid: paidFees, pending: pendingFees },
        attendance: { rate: attendanceRate.toFixed(1) },
        performance: { average: avgPerformance.toFixed(1) },
        studentCount: db.students.length,
        staffCount: db.staff.length
      });
    }

    if (role === "Teaching Staff") {
      const classPerformance = db.exams.reduce((sum, e) => sum + (e.marks / e.totalMarks) * 100, 0) / db.exams.length || 0;
      const attendanceSummary = (db.attendance.filter(a => a.status === "Present").length / db.attendance.length) * 100 || 0;

      return res.json({
        classPerformance: classPerformance.toFixed(1),
        attendanceSummary: attendanceSummary.toFixed(1)
      });
    }

    if (role === "Student" || role === "Parent") {
      const targetStudentId = studentId || userId;
      const studentExams = db.exams.filter(e => e.studentId === targetStudentId);
      const studentAttendance = db.attendance.filter(a => a.studentId === targetStudentId);
      const performance = studentExams.reduce((sum, e) => sum + (e.marks / e.totalMarks) * 100, 0) / studentExams.length || 0;
      const attendanceRate = (studentAttendance.filter(a => a.status === "Present").length / studentAttendance.length) * 100 || 0;

      return res.json({
        performance: performance.toFixed(1),
        attendanceRate: attendanceRate.toFixed(1),
        results: studentExams
      });
    }

    if (role === "HR") {
      return res.json({
        staffSummary: {
          total: db.staff.length,
          teaching: db.staff.filter(s => s.role === "Teaching Staff").length,
          nonTeaching: db.staff.filter(s => s.role === "Non-Teaching Staff").length
        }
      });
    }

    res.status(403).json({ message: "Unauthorized" });
  });

  app.get("/api/settings", (req, res) => {
    res.json(db.settings);
  });

  app.put("/api/settings", (req, res) => {
    const { role } = req.query;
    if (role !== "Admin") {
      return res.status(403).json({ success: false, message: "Only Admin can modify settings" });
    }
    db.settings = { ...db.settings, ...req.body };
    res.json({ success: true, settings: db.settings });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    // Redirect root to home.html
    app.get('/', (req, res) => {
      res.redirect('/home.html');
    });

    // Handle HTML files in dev mode - BEFORE vite.middlewares
    app.get('*.html', async (req, res, next) => {
      const url = req.path;
      try {
        const filePath = path.resolve(process.cwd(), url.slice(1));
        if (fs.existsSync(filePath)) {
          let template = await fs.promises.readFile(filePath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    app.get('/', (req, res) => {
      res.redirect('/home.html');
    });

    app.get('*', (req, res) => {
      // For production, we might need to handle specific HTML files
      const url = req.url;
      if (url.endsWith('.html')) {
        res.sendFile(path.join(distPath, url));
      } else {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
