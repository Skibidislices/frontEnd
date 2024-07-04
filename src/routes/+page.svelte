<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import api from '$lib/axios';
  import Chart from '$lib/components/Chart.svelte';

  let isDragging = writable(false);
  let file = null;
  let message = '';
  let jsonData = writable(null);

  let timetableData;
  let teachersData;
  let coursesData;
  let studentsData;

  let teacherHoursChart = writable({});
  let studentHoursChart = writable({});
  let studentsPerStudyChart = writable({});
  let classesPerDayChart = writable({});
  let wrongScheduleEntries = writable([]);

  onMount(async () => {
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    try {
      const response = await api.get('/load-latest-excel');
      jsonData.set(response.data);
      message = 'Data loaded successfully';
      processJsonData(response.data);
    } catch (error) {
      message = 'Error loading data';
      console.error('Error loading data:', error);
    }

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  });

  function handleDragOver(event) {
    event.preventDefault();
    isDragging.set(true);
  }

  function handleDragLeave(event) {
    if (event.clientX === 0 && event.clientY === 0) {
      isDragging.set(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging.set(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      file = files[0];
      uploadFile(file);
    }
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      jsonData.set(response.data);
      message = 'File uploaded successfully';
      processJsonData(response.data);
    } catch (error) {
      message = 'Error uploading file';
      console.error('Error uploading file:', error);
    }
  }

  function processJsonData(data) {
    timetableData = data.timetable;
    teachersData = data.teachers;
    coursesData = data.courses;
    studentsData = data.students;

    createCharts();
    findWrongScheduleEntries();
  }

  function createCharts() {
    const teacherHours = teachersData.map(teacher => {
      const totalHours = calculateTeacherHours(teacher).totalHours;
      return { teacher: teacher.full_name, totalHours };
    });

    const teacherLabels = teacherHours.map(t => t.teacher);
    const teacherData = teacherHours.map(t => t.totalHours);

    teacherHoursChart.set({
      type: 'bar',
      data: {
        labels: teacherLabels,
        datasets: [
          {
            label: 'Total Hours per Teacher',
            data: teacherData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Teachers'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Hours'
            }
          }
        }
      },
    });

    const studentHours = studentsData.map(student => {
      const totalHours = calculateStudentHours(student).totalHours;
      return { student: student.full_name, totalHours };
    });

    const studentLabels = studentHours.map(s => s.student);
    const studentData = studentHours.map(s => s.totalHours);

    studentHoursChart.set({
      type: 'bar',
      data: {
        labels: studentLabels,
        datasets: [
          {
            label: 'Total Hours per Student',
            data: studentData,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Students'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Hours'
            }
          }
        }
      },
    });

    const studyProgramCount = studentsData.reduce((acc, student) => {
      acc[student.study] = (acc[student.study] || 0) + 1;
      return acc;
    }, {});

    const studyLabels = Object.keys(studyProgramCount);
    const studentCounts = Object.values(studyProgramCount);

    studentsPerStudyChart.set({
      type: 'pie',
      data: {
        labels: studyLabels,
        datasets: [
          {
            label: 'Students per Study Program',
            data: studentCounts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    const classesPerDayCount = timetableData.reduce((acc, entry) => {
      acc[entry.date] = (acc[entry.date] || 0) + 1;
      return acc;
    }, {});

    const dayLabels = Object.keys(classesPerDayCount);
    const classCounts = Object.values(classesPerDayCount);

    classesPerDayChart.set({
      type: 'bar',
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: 'Classes per Day',
            data: classCounts,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Classes'
            }
          }
        }
      },
    });
  }

  function calculateTeacherHours(teacher) {
    const activities = timetableData.filter(activity => activity["teacher email"] === teacher.email);
    let totalHours = 0;

    activities.forEach(activity => {
      const [startTime, endTime] = activity["time slot"].split('-').map(time => {
        const [hours, minutes] = time.split(':');
        return parseInt(hours) + parseInt(minutes) / 60;
      });
      totalHours += (endTime - startTime);
    });

    return { totalHours };
  }

  function calculateStudentHours(student) {
    const activities = timetableData.filter(activity => activity["student group"] === student["group name"]);
    let totalHours = 0;

    activities.forEach(activity => {
      const [startTime, endTime] = activity["time slot"].split('-').map(time => {
        const [hours, minutes] = time.split(':');
        return parseInt(hours) + parseInt(minutes) / 60;
      });
      totalHours += (endTime - startTime);
    });

    return { totalHours };
  }

  function findWrongScheduleEntries() {
    const wrongEntries = [];

    teachersData.forEach(teacher => {
      const activities = timetableData.filter(activity => activity["teacher email"] === teacher.email);

      activities.forEach(activity => {
        let day = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long' });
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        if (teacher[day] === 'no' || (teacher['specific days off'] && teacher['specific days off'].split(', ').includes(activity.date))) {
          wrongEntries.push({
            teacher: teacher.full_name,
            date: activity.date,
            timeSlot: activity["time slot"],
            classroom: activity.classroom,
          });
        }
      });
    });

    wrongScheduleEntries.set(wrongEntries);
  }

  onMount(() => {
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  });
</script>

<style>
  .drop-zone {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 1.5rem;
    z-index: 1000;
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
  }
  .drop-zone.active {
    opacity: 1;
    pointer-events: all;
  }
  .hidden-input {
    display: none;
  }
  .file-list {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .section {
    flex: 1;
    max-width: 48%;
  }
  .chart-container, .info-box, .conflicts {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 1;
    margin-bottom: 20px;
  }
  .conflicts.hidden, .info-box.hidden {
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
  }
  .conflict {
    color: white;
    background-color: red;
    padding: 10px;
    border-radius: 8px;
    margin: 5px 0;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-20px);
    animation: slideDown 0.3s forwards;
  }
  @keyframes slideDown {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .teacher-selection {
    margin-top: 20px;
  }
</style>

<div class="border-dashed border-2 border-blue-500 p-4 max-w-md mx-auto mt-5 rounded-lg shadow-lg">
  <p class="text-center text-black font-normal">Drag and drop a file to preview.</p>
</div>

<div class="drop-zone { $isDragging ? 'active' : '' }">
  <p>Drag and drop your Excel file here</p>
  <input type="file" accept=".xlsx, .xls" class="hidden-input" on:change={e => uploadFile(e.target.files[0])} />
</div>

<p>{message}</p>

<div class="file-list">
  {#if $jsonData}
  <div class="section">
    <div class="chart-container">
      <h2>Total Hours per Teacher</h2>
      {#if $teacherHoursChart}
      <Chart type={$teacherHoursChart.type} data={$teacherHoursChart.data} options={$teacherHoursChart.options} />
      {/if}
    </div>

    <div class="conflicts">
      <h2>Wrong Schedule Entries</h2>
      <ul>
        {#each $wrongScheduleEntries as entry}
        <li class="conflict">
          {entry.teacher} - {entry.date} - {entry.timeSlot} in {entry.classroom}
        </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="chart-container">
      <h2>Total Hours per Student</h2>
      {#if $studentHoursChart}
      <Chart type={$studentHoursChart.type} data={$studentHoursChart.data} options={$studentHoursChart.options} />
      {/if}
    </div>
    <div class="chart-container">
      <h2>Classes per Day</h2>
      {#if $classesPerDayChart}
      <Chart type={$classesPerDayChart.type} data={$classesPerDayChart.data} options={$classesPerDayChart.options} />
      {/if}
    </div>
    <div class="chart-container">
      <h2>Total Hours per Study Program</h2>
      {#if $studentsPerStudyChart}
      <Chart type={$studentsPerStudyChart.type} data={$studentsPerStudyChart.data} options={$studentsPerStudyChart.options} />
      {/if}
    </div>
  </div>
  {/if}
</div>
