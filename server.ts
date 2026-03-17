import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password, role } = req.body;
    console.log(`Login attempt: ${username} as ${role}`);
    res.json({ success: true, user: { username, role } });
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
