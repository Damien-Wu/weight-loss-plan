// 30天减肥计划网站脚本

// 导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('active');
    });
  }
  
  // 返回顶部按钮
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // FAQ 问答切换
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      this.classList.toggle('active');
      const answer = this.nextElementSibling;
      answer.classList.toggle('active');
    });
  });
  
  // 标签页切换
  const tabLinks = document.querySelectorAll('.tabs a');
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 移除所有标签的活动状态
      tabLinks.forEach(l => l.classList.remove('active'));
      
      // 添加当前标签的活动状态
      this.classList.add('active');
      
      // 获取目标内容ID
      const targetId = this.getAttribute('href').substring(1);
      
      // 隐藏所有内容
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.style.display = 'none';
      });
      
      // 显示目标内容
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });
  
  // 如果有标签页，默认显示第一个
  if (tabLinks.length > 0) {
    tabLinks[0].click();
  }
  
  // 日期选择器
  setupDateSelector();
  
  // 进度跟踪表单
  setupProgressForm();
  
  // 初始化进度图表
  initProgressCharts();
});

// 日期选择器设置
function setupDateSelector() {
  const prevButton = document.querySelector('.date-selector-prev');
  const nextButton = document.querySelector('.date-selector-next');
  const currentText = document.querySelector('.date-selector-current');
  const dayLinks = document.querySelectorAll('.date-selector-days a');
  
  if (prevButton && nextButton && currentText) {
    let currentWeek = 1;
    const totalWeeks = 4;
    
    updateDateSelectorText();
    
    prevButton.addEventListener('click', function() {
      if (currentWeek > 1) {
        currentWeek--;
        updateDateSelectorText();
        updatePlanContent();
      }
    });
    
    nextButton.addEventListener('click', function() {
      if (currentWeek < totalWeeks) {
        currentWeek++;
        updateDateSelectorText();
        updatePlanContent();
      }
    });
    
    function updateDateSelectorText() {
      currentText.textContent = `第${currentWeek}周`;
      
      // 禁用/启用导航按钮
      prevButton.disabled = currentWeek === 1;
      nextButton.disabled = currentWeek === totalWeeks;
    }
    
    function updatePlanContent() {
      // 隐藏所有周计划
      const weekPlans = document.querySelectorAll('.week-plan');
      weekPlans.forEach(plan => {
        plan.style.display = 'none';
      });
      
      // 显示当前周计划
      const currentPlan = document.getElementById(`week-${currentWeek}`);
      if (currentPlan) {
        currentPlan.style.display = 'block';
      }
    }
  }
  
  // 日期选择
  if (dayLinks.length > 0) {
    dayLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 移除所有日期的活动状态
        dayLinks.forEach(l => l.classList.remove('active'));
        
        // 添加当前日期的活动状态
        this.classList.add('active');
        
        // 获取选中的日期
        const day = this.getAttribute('data-day');
        
        // 更新日计划内容
        updateDayPlan(day);
      });
    });
    
    // 默认选中第一天
    dayLinks[0].click();
  }
}

// 更新日计划内容
function updateDayPlan(day) {
  // 隐藏所有日计划
  const dayPlans = document.querySelectorAll('.day-plan');
  dayPlans.forEach(plan => {
    plan.style.display = 'none';
  });
  
  // 显示选中的日计划
  const selectedPlan = document.getElementById(`day-${day}`);
  if (selectedPlan) {
    selectedPlan.style.display = 'block';
  }
}

// 进度跟踪表单设置
function setupProgressForm() {
  const progressForm = document.getElementById('progress-form');
  if (progressForm) {
    progressForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取表单数据
      const date = document.getElementById('progress-date').value;
      const weight = document.getElementById('progress-weight').value;
      const waist = document.getElementById('progress-waist').value;
      
      // 验证数据
      if (!date || !weight) {
        alert('请填写日期和体重');
        return;
      }
      
      // 保存数据到本地存储
      saveProgressData(date, weight, waist);
      
      // 更新图表
      updateProgressCharts();
      
      // 重置表单
      progressForm.reset();
      
      // 显示成功消息
      alert('进度记录已保存');
    });
  }
}

// 保存进度数据到本地存储
function saveProgressData(date, weight, waist) {
  // 获取现有数据
  let progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  
  // 添加新数据
  progressData.push({
    date: date,
    weight: parseFloat(weight),
    waist: waist ? parseFloat(waist) : null
  });
  
  // 按日期排序
  progressData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 保存回本地存储
  localStorage.setItem('progressData', JSON.stringify(progressData));
}

// 初始化进度图表
function initProgressCharts() {
  const weightChartCanvas = document.getElementById('weight-chart');
  const waistChartCanvas = document.getElementById('waist-chart');
  
  if (weightChartCanvas || waistChartCanvas) {
    updateProgressCharts();
  }
}

// 更新进度图表
function updateProgressCharts() {
  const weightChartCanvas = document.getElementById('weight-chart');
  const waistChartCanvas = document.getElementById('waist-chart');
  
  // 获取进度数据
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  
  if (progressData.length === 0) {
    return;
  }
  
  // 提取日期和数据
  const dates = progressData.map(item => item.date);
  const weights = progressData.map(item => item.weight);
  const waists = progressData.map(item => item.waist);
  
  // 更新体重图表
  if (weightChartCanvas) {
    const ctx = weightChartCanvas.getContext('2d');
    
    // 如果已有图表，销毁它
    if (window.weightChart) {
      window.weightChart.destroy();
    }
    
    // 创建新图表
    window.weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: '体重 (kg)',
          data: weights,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
  
  // 更新腰围图表
  if (waistChartCanvas && waists.some(w => w !== null)) {
    const ctx = waistChartCanvas.getContext('2d');
    
    // 如果已有图表，销毁它
    if (window.waistChart) {
      window.waistChart.destroy();
    }
    
    // 创建新图表
    window.waistChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: '腰围 (cm)',
          data: waists,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
}

// 打印功能
function printPlan() {
  window.print();
}
