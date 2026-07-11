const transporter = require("../config/emailVerify");

const sendStudentReport = async (
  student,
  attendancePercentage,
  averageMarks,
  examResults,
) => {
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:800px;margin:auto;padding:20px">

    <h2 style="text-align:center;color:#2563eb">
      Student Performance Report
    </h2>

    <table border="1" cellspacing="0" cellpadding="10" width="100%">
      <tr>
        <th align="left">Student Name</th>
        <td>${student.name}</td>
      </tr>

      <tr>
        <th align="left">Email</th>
        <td>${student.email}</td>
      </tr>

      <tr>
        <th align="left">Attendance</th>
        <td>${attendancePercentage}%</td>
      </tr>

      <tr>
        <th align="left">Average Marks</th>
        <td>${averageMarks}</td>
      </tr>
    </table>

    <br>

    <h3>Exam Results</h3>

    <table
      border="1"
      cellspacing="0"
      cellpadding="8"
      width="100%"
    >
      <tr>
        <th>Exam</th>
        <th>Marks</th>
        <th>Total</th>
      </tr>

      ${examResults
        .map(
          (exam) => `
        <tr>
          <td>${exam.examName}</td>
          <td>${exam.obtainedMarks}</td>
          <td>${exam.totalMarks}</td>
        </tr>
      `,
        )
        .join("")}

    </table>

    <br>

    <p>Regards,<br><b>Institute Management System</b></p>

  </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: student.email,
    subject: "Student Performance Report",
    html,
  });
};

module.exports = sendStudentReport;
