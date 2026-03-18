import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Storage
  const db = {
    students: [
      { id: "1", name: "John Doe", grade: "10th", section: "A", rollNo: "101" },
      { id: "2", name: "Jane Smith", grade: "9th", section: "B", rollNo: "202" }
    ],
    staff: [
      { id: "1", name: "Mr. Sharma", role: "Teaching Staff", subject: "Math" },
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
    attendance: [] as any[],
    exams: [] as any[]
  };

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password, role } = req.body;
    console.log(`Login attempt: ${username} as ${role}`);
    // Simple mock login
    if (username === "admin" && password === "admin" && role === "Admin") {
      res.json({ success: true, user: { username, role } });
    } else if (username === "teacher" && password === "teacher" && role === "Teaching Staff") {
      res.json({ success: true, user: { username, role } });
    } else if (username === "student1" && password === "student1" && role === "Student") {
      res.json({ success: true, user: { username, role, studentId: "1" } });
    } else if (username === "parent1" && password === "parent1" && role === "Parent") {
      res.json({ success: true, user: { username, role, studentId: "1" } });
    } else if (role !== "Admin") {
      // Allow other roles for demo purposes if needed
      res.json({ success: true, user: { username, role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Students API
  app.get("/api/students", (req, res) => {
    const { id } = req.query;
    if (id) {
      const student = db.students.find(s => s.id === id);
      return res.json(student ? [student] : []);
    }
    res.json(db.students);
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
  app.get("/api/staff", (req, res) => res.json(db.staff));
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
    const { studentId } = req.query;
    if (studentId) {
      return res.json(db.fees.filter(f => f.studentId === studentId));
    }
    res.json(db.fees);
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
  app.get("/api/transport", (req, res) => res.json(db.transport));
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
  app.get("/api/admissions", (req, res) => res.json(db.admissions));
  app.post("/api/admissions", (req, res) => {
    const newAdm = { id: Date.now().toString(), ...req.body };
    db.admissions.push(newAdm);
    res.json({ success: true, admission: newAdm });
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
    const { date, studentId } = req.query;
    let filtered = db.attendance;
    if (date) {
      filtered = filtered.filter(a => a.date === date);
    }
    if (studentId) {
      filtered = filtered.filter(a => a.studentId === studentId);
    }
    res.json(filtered);
  });
  app.post("/api/attendance", (req, res) => {
    const { studentId, status, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Upsert logic
    const index = db.attendance.findIndex(a => a.studentId === studentId && a.date === targetDate);
    if (index !== -1) {
      db.attendance[index].status = status;
      res.json({ success: true, record: db.attendance[index], updated: true });
    } else {
      const record = { id: Date.now().toString(), studentId, status, date: targetDate };
      db.attendance.push(record);
      res.json({ success: true, record, updated: false });
    }
  });

  // Exams API
  app.get("/api/exams", (req, res) => {
    const { studentId } = req.query;
    if (studentId) {
      return res.json(db.exams.filter(e => e.studentId === studentId));
    }
    res.json(db.exams);
  });
  app.post("/api/exams", (req, res) => {
    const record = { id: Date.now().toString(), ...req.body };
    db.exams.push(record);
    res.json({ success: true, record });
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
