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
  let courseHoursChart = writable({});
  let classesPerDayChart = writable({});
  let wrongScheduleEntries = writable([]);
  let teacherTimeframe = writable('all');
  let studentTimeframe = writable('all');

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
    updateTeacherHoursChart('all');
    updateStudentHoursChart('all');
    updateCourseHoursChart('all');
    createClassesPerDayChart();
  }

  function createClassesPerDayChart() {
    const classesPerDayCount = timetableData.reduce((acc, entry) => {
      acc[new Date(entry.start_time).toLocaleDateString('en-US')] = (acc[new Date(entry.start_time).toLocaleDateString('en-US')] || 0) + 1;
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

  function calculateHours(activities) {
    let totalHours = 0;

    activities.forEach(activity => {
      const duration = (new Date(activity.end_time) - new Date(activity.start_time)) / (1000 * 60 * 60);
      totalHours += duration;
    });

    return totalHours;
  }

  function filterActivitiesByTimeframe(activities, timeframe) {
    if (timeframe == 'all') return activities;

    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'week':
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
      default:
        return activities;
    }

    return activities.filter(activity => new Date(activity.start_time) >= startDate);
  }

  function updateTeacherHoursChart(timeframe) {
    const teacherHours = teachersData.map(teacher => {
      const activities = filterActivitiesByTimeframe(timetableData.filter(activity => activity["teacher_id"] === teacher.id), timeframe);
      const totalHours = calculateHours(activities);
      return { teacher: teacher.name, totalHours };
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
  }

  function updateStudentHoursChart(timeframe) {
    const studentHours = studentsData.map(student => {
      const activities = filterActivitiesByTimeframe(timetableData.filter(activity => activity["group"] === student.group), timeframe);
      const totalHours = calculateHours(activities);
      return { student: student.name, totalHours };
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
  }

  function updateCourseHoursChart(timeframe) {
    const courseHours = coursesData.map(course => {
      const activities = filterActivitiesByTimeframe(timetableData.filter(activity => activity["course_id"] === course.id), timeframe);
      const totalHours = calculateHours(activities);
      return { course: course.name, totalHours };
    });

    const courseLabels = courseHours.map(c => c.course);
    const courseData = courseHours.map(c => c.totalHours);
    const backgroundColors = courseHours.map((_, i) => `hsl(${i * 360 / courseHours.length}, 70%, 50%)`);

    courseHoursChart.set({
      type: 'pie',
      data: {
        labels: courseLabels,
        datasets: [
          {
            label: 'Total Hours per Course',
            data: courseData,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('50%', '40%')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }


  function findWrongScheduleEntries() {
    const wrongEntries = [];

    teachersData.forEach(teacher => {
      const activities = timetableData.filter(activity => activity["teacher_id"] === teacher.id);

      activities.forEach(activity => {
        let day = new Date(activity.start_time).toLocaleDateString('en-US', { weekday: 'long' });
        day = day.toLowerCase();
        if (teacher[day] === 'no' || (teacher.specific_days_off && teacher.specific_days_off.split(', ').includes(new Date(activity.start_time).toLocaleDateString('en-US')))) {
          wrongEntries.push({
            teacher: teacher.name,
            date: new Date(activity.start_time).toLocaleDateString('en-US'),
            timeSlot: `${new Date(activity.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(activity.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            classroom: activity.classroom,
          });
        }
      });
    });

    wrongScheduleEntries.set(wrongEntries);
  }
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
  .timeframe-selector {
    margin-bottom: 10px;
  }
</style>

<div class="border-dashed border-2 border-blue-500 p-4 max-w-md mx-auto mt-5 rounded-lg shadow-lg">
  <p class="text-center text-black font-normal">Drag and drop a file to preview.</p>
</div>

<div class="drop-zone { $isDragging ? 'active' : '' }">
  <p>Drag and drop your Excel file here</p>
  <input type="file" accept=".xlsx, .xls" class="hidden-input" on:change={e => uploadFile(e.target.files[0])} />
</div>

<div class="file-list">
  {#if $jsonData}
  <div class="section">
    <div class="chart-container">
      <h2>Total Hours per Teacher</h2>
      <div class="timeframe-selector">
        <label for="teacher-timeframe">Timeframe:</label>
        <select id="teacher-timeframe" on:change={(e) => updateTeacherHoursChart(e.target.value)}>
          <option value="all">All Time</option>
          <option value="month">Last Month</option>
          <option value="week">Last Week</option>
        </select>
      </div>
      {#if $teacherHoursChart}
      <Chart type={$teacherHoursChart.type} data={$teacherHoursChart.data} options={$teacherHoursChart.options} />
      {/if}
    </div>
    <div class="chart-container">
      <h2>Classes per Day</h2>
      {#if $classesPerDayChart}
      <Chart type={$classesPerDayChart.type} data={$classesPerDayChart.data} options={$classesPerDayChart.options} />
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
      <div class="timeframe-selector">
        <label for="student-timeframe">Timeframe:</label>
        <select id="student-timeframe" on:change={(e) => updateStudentHoursChart(e.target.value)}>
          <option value="all">All Time</option>
          <option value="month">Last Month</option>
          <option value="week">Last Week</option>
        </select>
      </div>
      {#if $studentHoursChart}
      <Chart type={$studentHoursChart.type} data={$studentHoursChart.data} options={$studentHoursChart.options} />
      {/if}
    </div>
    <div class="chart-container">
      <h2>Total Hours per Course</h2>
      {#if $courseHoursChart}
      <Chart type={$courseHoursChart.type} data={$courseHoursChart.data} options={$courseHoursChart.options} />
      {/if}
    </div>
  </div>
  {/if}
</div>
