// 图图的任务清单 - JavaScript

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const WEEKDAYS_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const WEEKDAYS_SHORT = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// 默认任务配置
const DEFAULT_TASKS = {
    monday: ['🧩 都都思维', '📺 英语动画片', '🥔 土豆逗两集', '📚 看中文书', '✍️ 写字课作业', '🎹 钢琴练习'],
    tuesday: ['🧸 小熊 app', '📺 英语动画片', '📖 三国演义一集', '🔤 学习拼音', '✍️ 写字课作业', '🎹 钢琴练习'],
    wednesday: ['🧩 都都思维', '📺 英语动画片', '🥔 土豆逗两集', '💻 英语线上课', '✍️ 写字课作业', '🎹 钢琴练习'],
    thursday: ['🧸 小熊 app', '📺 英语动画片', '📖 三国演义一集', '🔤 学习拼音', '✍️ 写字课作业', '🎹 钢琴练习'],
    friday: ['🧩 都都思维', '🧸 小熊 app', '📺 英语动画片', '🥔 土豆逗两集', '💻 英语线上课', '📚 看中文书'],
    saturday: ['✍️ 写字课', '🥊 散打课', '🧸 小熊 app', '🎬 纪录片一集', '📚 看中文书', '🔤 学习拼音', '🎹 钢琴练习', '📖 学而思能力书'],
    sunday: ['🎹 钢琴课', '🧩 都都思维', '🧸 小熊 app', '📺 英语动画片', '📝 钢琴书面作业', '📚 看中文书', '💻 英语线上课', '⚽ 户外/运动', '🎬 纪录片一集']
};

let currentEditDay = 'monday';

// 获取今天星期几
function getTodayWeekday() {
    const today = new Date();
    return WEEKDAYS[today.getDay()];
}

// 获取今天显示文本
function getTodayDisplay() {
    const today = new Date();
    return WEEKDAYS_CN[today.getDay()];
}

// 获取存储的数据
function getStorage() {
    const data = localStorage.getItem('tudouData');
    return data ? JSON.parse(data) : { tasks: {}, history: {} };
}

// 保存数据
function saveStorage(data) {
    localStorage.setItem('tudouData', JSON.stringify(data));
}

// 获取某天的任务
function getTasks(weekday) {
    const storage = getStorage();
    if (!storage.tasks[weekday]) {
        storage.tasks[weekday] = [];
        saveStorage(storage);
    }
    return storage.tasks[weekday];
}

// 保存某天的任务
function saveTasks(weekday, tasks) {
    const storage = getStorage();
    storage.tasks[weekday] = tasks;
    saveStorage(storage);
}

// 获取某天的完成状态
function getDayState(weekday) {
    const storage = getStorage();
    if (!storage.history[weekday]) {
        storage.history[weekday] = [];
        saveStorage(storage);
    }
    return storage.history[weekday];
}

// 保存某天的完成状态
function saveDayState(weekday, state) {
    const storage = getStorage();
    storage.history[weekday] = state;
    saveStorage(storage);
}

// 初始化默认任务
function initDefaultTasks() {
    const storage = {
        tasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
        history: {}
    };
    saveStorage(storage);
    
    document.getElementById('initSection').style.display = 'none';
    document.getElementById('editSection').style.display = 'block';
    showEditDaySelector();
    
    // 显示成功提示
    const successDiv = document.getElementById('saveSuccess');
    successDiv.textContent = '🎉 初始化成功！';
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
        successDiv.textContent = '✅ 已保存';
    }, 3000);
}

// 初始化今日任务
function initTodayTasks() {
    const weekday = getTodayWeekday();
    const tasks = getTasks(weekday);
    const state = getDayState(weekday);
    
    const taskList = document.getElementById('todayTaskList');
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>今天还没有任务哦～</p><p style="margin-top: 10px;">去"设置"里添加任务吧！</p></div>';
        document.getElementById('progressText').textContent = '完成进度：0/0';
        document.getElementById('progressFill').style.width = '0%';
        return;
    }
    
    tasks.forEach((task, index) => {
        const completed = state[index] || false;
        const li = document.createElement('li');
        li.className = `task-item${completed ? ' completed' : ''}`;
        li.onclick = () => toggleTodayTask(index, li);
        li.innerHTML = `
            <div class="checkbox"></div>
            <span class="task-text">${task}</span>
        `;
        taskList.appendChild(li);
    });
    
    updateProgress(tasks.length, state.filter(s => s).length);
}

// 切换今日任务状态
function toggleTodayTask(index, element) {
    const weekday = getTodayWeekday();
    const state = getDayState(weekday);
    state[index] = !state[index];
    saveDayState(weekday, state);
    element.classList.toggle('completed');
    
    const tasks = getTasks(weekday);
    updateProgress(tasks.length, state.filter(s => s).length);
    
    if (state[index]) {
        createConfetti();
    }
}

// 更新进度
function updateProgress(total, completed) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `完成进度：${completed}/${total}`;
    
    if (completed === total && total > 0) {
        document.getElementById('progressText').textContent = '🎉 太棒了！全部完成！';
    }
}

// 切换页面
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    if (page === 'today') {
        document.getElementById('today-page').classList.add('active');
        document.querySelectorAll('.nav-tab')[0].classList.add('active');
        initTodayTasks();
    } else if (page === 'edit') {
        document.getElementById('edit-page').classList.add('active');
        document.querySelectorAll('.nav-tab')[1].classList.add('active');
        showEditPage();
    } else {
        document.getElementById('history-page').classList.add('active');
        document.querySelectorAll('.nav-tab')[2].classList.add('active');
        showHistoryList();
    }
}

// 显示设置页面
function showEditPage() {
    const storage = getStorage();
    const hasData = storage.tasks && Object.keys(storage.tasks).length > 0;
    
    if (hasData && storage.tasks.monday && storage.tasks.monday.length > 0) {
        document.getElementById('initSection').style.display = 'none';
        document.getElementById('editSection').style.display = 'block';
        showEditDaySelector();
    } else {
        document.getElementById('initSection').style.display = 'block';
        document.getElementById('editSection').style.display = 'none';
    }
}

// 显示编辑日期选择器
function showEditDaySelector() {
    const selector = document.getElementById('editDaySelector');
    selector.innerHTML = '';
    
    WEEKDAYS.forEach((day, index) => {
        const btn = document.createElement('button');
        btn.className = `edit-day-btn${day === currentEditDay ? ' active' : ''}`;
        btn.textContent = WEEKDAYS_SHORT[index];
        btn.onclick = () => selectEditDay(day, index);
        selector.appendChild(btn);
    });
    
    showEditTasks();
}

// 选择编辑日期
function selectEditDay(day, index) {
    currentEditDay = day;
    document.querySelectorAll('.edit-day-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    showEditTasks();
}

// 显示编辑任务列表
function showEditTasks() {
    const tasks = getTasks(currentEditDay);
    const taskList = document.getElementById('editTaskList');
    const title = document.getElementById('editDayTitle');
    
    const dayIndex = WEEKDAYS.indexOf(currentEditDay);
    title.textContent = `${WEEKDAYS_CN[dayIndex]} - ${tasks.length} 项任务`;
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state" style="padding: 20px;"><p>还没有任务，添加一个吧！</p></div>';
        return;
    }
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'edit-task-item';
        li.innerHTML = `
            <input type="text" value="${task}" onchange="updateTask(${index}, this.value)">
            <button class="delete-btn" onclick="deleteTask(${index})">删除</button>
        `;
        taskList.appendChild(li);
    });
}

// 更新任务
function updateTask(index, value) {
    const tasks = getTasks(currentEditDay);
    tasks[index] = value;
    saveTasks(currentEditDay, tasks);
    showSaveSuccess();
}

// 添加任务
function addTask() {
    const input = document.getElementById('newTaskInput');
    const value = input.value.trim();
    
    if (!value) return;
    
    const tasks = getTasks(currentEditDay);
    tasks.push(value);
    saveTasks(currentEditDay, tasks);
    
    input.value = '';
    showEditTasks();
    showSaveSuccess();
}

// 删除任务
function deleteTask(index) {
    const tasks = getTasks(currentEditDay);
    tasks.splice(index, 1);
    saveTasks(currentEditDay, tasks);
    showEditTasks();
    showSaveSuccess();
}

// 显示保存成功
function showSaveSuccess() {
    const successDiv = document.getElementById('saveSuccess');
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 2000);
}

// 显示历史列表
function showHistoryList() {
    document.getElementById('historyDetail').style.display = 'none';
    const storage = getStorage();
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    const dates = Object.keys(storage.history).filter(d => d !== 'tasks').sort().reverse();
    
    if (dates.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>暂无历史记录</p></div>';
        return;
    }
    
    dates.forEach(date => {
        const state = storage.history[date];
        const tasks = getTasks(date);
        const completed = state.filter(s => s).length;
        const total = tasks.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const li = document.createElement('li');
        li.className = 'history-item';
        li.onclick = () => showHistoryDetail(date);
        li.innerHTML = `
            <div class="history-date">${WEEKDAYS_CN[WEEKDAYS.indexOf(date)] || date}</div>
            <div class="history-stats">
                <span class="completed">✓ 完成 ${completed}/${total}</span>
                <span>完成率 ${percent}%</span>
            </div>
        `;
        historyList.appendChild(li);
    });
}

// 显示历史详情
function showHistoryDetail(date) {
    document.getElementById('historyList').style.display = 'none';
    document.getElementById('historyDetail').style.display = 'block';
    
    const storage = getStorage();
    const state = storage.history[date];
    const tasks = getTasks(date);
    
    document.getElementById('detailDate').textContent = WEEKDAYS_CN[WEEKDAYS.indexOf(date)] || date;
    const tasksDiv = document.getElementById('detailTasks');
    tasksDiv.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksDiv.innerHTML = '<div class="empty-state"><p>暂无任务</p></div>';
        return;
    }
    
    state.forEach((done, index) => {
        const task = tasks[index] || '未知任务';
        const div = document.createElement('div');
        div.className = `detail-task ${done ? 'done' : 'not-done'}`;
        div.textContent = `${done ? '✓' : '✗'} ${task}`;
        tasksDiv.appendChild(div);
    });
}

// 返回列表
function showHistoryList() {
    document.getElementById('historyDetail').style.display = 'none';
    document.getElementById('historyList').style.display = 'block';
}

// 放烟花
function createConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('todayDisplay').textContent = getTodayDisplay();
    initTodayTasks();
});
