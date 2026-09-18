<div align="center">
  

  <br />

  [![Live Demo](https://img.shields.io/badge/🔴_Live_Demo-job--tracker--drab--mu.vercel.app-blue?style=for-the-badge&logo=vercel)](https://job-tracker-drab-mu.vercel.app)
  
  <br />

  <!-- Tech Stack Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

---

<div align="center">
  <em>JobTracker is designed to simplify the chaotic job search process. Search for jobs, apply, save favorites, and track interview stages seamlessly, backed by a comprehensive Admin Dashboard for recruiters.</em>
</div>

---

## 🚀 Live Demo & Visuals

🌐 **Live Website:** [job-tracker-drab-mu.vercel.app](https://job-tracker-drab-mu.vercel.app)



---

## ✨ Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>👤 Candidate Portal</h3>
      <ul>
        <li><b>🔐 Secure Access:</b> Seamless user registration and login.</li>
        <li><b>💼 Job Discovery:</b> Advanced search and filter for listings.</li>
        <li><b>📝 1-Click Apply:</b> Apply directly through the platform.</li>
        <li><b>❤️ Save for Later:</b> Bookmark favorite job opportunities.</li>
        <li><b>📊 Progress Tracking:</b> Real-time application status updates.</li>
        <li><b>📅 Interview Manager:</b> Schedule and prep for interviews.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🛠️ Recruiter Dashboard</h3>
      <ul>
        <li><b>📊 Analytics:</b> High-level overview of portal metrics.</li>
        <li><b>📋 Job Management:</b> Create, update, and delete postings.</li>
        <li><b>👥 Applicant Tracking:</b> Review candidate profiles and resumes.</li>
        <li><b>🔄 Pipeline Control:</b> Move candidates (Pending ➔ Hired).</li>
        <li><b>📅 Coordination:</b> Set up candidate interview schedules.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🧑‍💻 Tech Stack Breakdown

| Category | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, React Router DOM, Axios, Lucide React, Vite |
| **Backend** | PHP (REST API architecture), Apache Server |
| **Database** | MySQL |
| **Deployment** | Vercel (Frontend), Render (Backend), Docker |

---

## 💻 Local Setup & Installation

Follow these instructions to run the project locally:

<details>
  <summary><b>1. Prerequisites</b></summary>
  <ul>
    <li>Node.js & npm installed</li>
    <li>XAMPP/WAMP (for local PHP/MySQL environment)</li>
  </ul>
</details>

<details>
  <summary><b>2. Backend Setup (PHP & MySQL)</b></summary>
  <ol>
    <li>Create a MySQL database named <code>jobtracker_db</code>.</li>
    <li>Import the provided <code>.sql</code> file into your database.</li>
    <li>Navigate to <code>backend/config/</code> and update your DB credentials.</li>
    <li>Start your Apache and MySQL servers via XAMPP.</li>
  </ol>
</details>

<details>
  <summary><b>3. Frontend Setup (React)</b></summary>
  
  ```bash
  # Clone the repository
  git clone [https://github.com/akashbojja/JobTracker.git](https://github.com/akashbojja/JobTracker.git)

  # Navigate to frontend and install dependencies
  cd JobTracker/frontend
  npm install

  # Configure environment variables (create a .env file)
  echo "VITE_API_BASE_URL=http://localhost/JobTracker/backend/api" > .env

  # Start the development server
  npm run dev
