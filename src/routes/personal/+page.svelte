<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import api from '$lib/axios';
    import Chart from '$lib/components/Chart.svelte';
    import { userEmail } from '$lib/auth';
  
    let timetableData = writable([]);
    let weeklyHours = writable([]);
    let upcomingAssessments = writable([]);
    let upcomingLectures = writable([]);
    let weeklyHoursChartConfig = writable(null);
    let currentEmail = writable('');
  
    userEmail.subscribe(email => {
      if (email) {
        currentEmail.set(email);
        fetchTimetable(email);
      }
    });
  
    async function fetchTimetable(email) {
      try {
        const response = await api.get(`/user-timetable?email=${email}`);
        console.log('Fetched timetable:', response.data);
        timetableData.set(response.data);
        processTimetable(response.data);
      } catch (error) {
        console.error('Error loading timetable:', error);
      }
    }
  
    function getWeekStartEnd(date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      return { start: startDate, end: endDate };
    }
  
    function processTimetable(data) {
      const now = new Date();
      const weeklyHoursMap = {};
      const assessments = [];
      const lectures = [];
  
      data.forEach(activity => {
        const activityDate = new Date(activity.date);
        activityDate.setFullYear(new Date().getFullYear()); // Set year to current year
        console.log(activity.date);
        if (activityDate < now) return;
  
        const { start, end } = getWeekStartEnd(activityDate);
        const weekKey = `${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`;
  
        if (!weeklyHoursMap[weekKey]) {
          weeklyHoursMap[weekKey] = 0;
        }
  
        const [startTime, endTime] = activity["time slot"].split('-').map(time => {
          const [hours, minutes] = time.split(':');
          return parseInt(hours) + parseInt(minutes) / 60;
        });
  
        weeklyHoursMap[weekKey] += (endTime - startTime);
  
        if (activity['is assessment']) {
          assessments.push(activity);
        } else {
          lectures.push(activity);
        }
      });
  
      const weeklyHoursArray = Object.keys(weeklyHoursMap).map(week => ({
        week,
        hours: weeklyHoursMap[week]
      }));
  
      weeklyHours.set(weeklyHoursArray);
      upcomingAssessments.set(assessments);
      upcomingLectures.set(lectures);
  
      // Create chart configuration for total hours per week
      weeklyHoursChartConfig.set({
        type: 'bar',
        data: {
          labels: weeklyHoursArray.map(week => week.week),
          datasets: [
            {
              label: 'Total Hours per Week',
              data: weeklyHoursArray.map(week => week.hours),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Week'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Hours'
              },
              beginAtZero: true
            }
          }
        }
      });
    }
  
    function handleEmailInput(event) {
      const email = event.target.value;
      if (email) {
        currentEmail.set(email);
        fetchTimetable(email);
      }
    }
  </script>
  
  <style>
    .container {
      display: flex;
      gap: 20px;
    }
    .section {
      flex: 1;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .upcoming {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .activity {
      padding: 10px;
      background-color: #fff;
      border-left: 5px solid #4CAF50;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .assessment {
      border-left-color: #FF9800;
    }
    .time {
      font-weight: bold;
    }
    .name {
      font-size: 1.2em;
      margin-bottom: 5px;
    }
    .overview {
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .email-input {
      margin-top: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 100%;
      max-width: 300px;
    }
  </style>
  
  <div class="overview">
    <h2>Overview of {$currentEmail}'s timetable</h2>
    <input
      type="email"
      placeholder="Enter email to view timetable"
      class="email-input"
      on:input={handleEmailInput}
    />
  </div>
  
  <div class="container">
    <div class="section">
      <h2>Total Hours Per Week</h2>
      {#if $weeklyHoursChartConfig}
        <Chart type={$weeklyHoursChartConfig.type} data={$weeklyHoursChartConfig.data} options={$weeklyHoursChartConfig.options} />
      {/if}
    </div>
  
    <div class="section">
      <h2>Upcoming Assessments</h2>
      <div class="upcoming">
        {#each $upcomingAssessments as assessment}
          <div class="activity assessment">
            <div class="time">{assessment.date} - {assessment["time slot"]}</div>
            <div class="name">{assessment["course id"]}</div>
            <div>{assessment.classroom}</div>
          </div>
        {/each}
      </div>
  
      <h2>Upcoming Lectures</h2>
      <div class="upcoming">
        {#each $upcomingLectures as lecture}
          <div class="activity">
            <div class="time">{lecture.date} - {lecture["time slot"]}</div>
            <div class="name">{lecture["course id"]}</div>
            <div>{lecture.classroom}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  