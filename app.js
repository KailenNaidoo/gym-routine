// Gym Routine Tracker App

(function () {
    'use strict';

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const daySelector = document.getElementById('daySelector');
    const dayTitle = document.getElementById('dayTitle');
    const exerciseList = document.getElementById('exerciseList');
    const addExerciseBtn = document.getElementById('addExercise');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalClose = document.getElementById('modalClose');
    const exerciseForm = document.getElementById('exerciseForm');
    const btnCancel = document.getElementById('btnCancel');

    // State
    let currentDay = 'monday';
    let editingId = null;
    let routines = loadRoutines();

    // Day names
    const dayNames = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    };

    // Initialize
    function init() {
        loadTheme();
        setActiveDay();
        renderExercises();
        bindEvents();
    }

    // Theme
    function loadTheme() {
        const saved = localStorage.getItem('gym-theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('gym-theme', next);
    }

    // Routines storage
    function loadRoutines() {
        const saved = localStorage.getItem('gym-routines');
        if (saved) return JSON.parse(saved);
        return getDefaultRoutines();
    }

    function saveRoutines() {
        localStorage.setItem('gym-routines', JSON.stringify(routines));
    }

    function getDefaultRoutines() {
        return {
            monday: [
                {
                    id: generateId(),
                    name: 'Bench Press',
                    sets: '4x10',
                    weight: '135 lbs',
                    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop',
                    video: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
                    notes: 'Keep shoulder blades pinched. Control the descent.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Incline Dumbbell Press',
                    sets: '3x12',
                    weight: '50 lbs',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
                    notes: '30 degree incline. Full range of motion.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Cable Flyes',
                    sets: '3x15',
                    weight: '25 lbs',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o',
                    notes: 'Squeeze at the top. Slow negatives.',
                    done: false
                }
            ],
            tuesday: [
                {
                    id: generateId(),
                    name: 'Barbell Squat',
                    sets: '5x5',
                    weight: '185 lbs',
                    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=200&fit=crop',
                    video: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
                    notes: 'Break at hips first. Keep chest up.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Romanian Deadlift',
                    sets: '4x10',
                    weight: '155 lbs',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=7j-2w4-P14I',
                    notes: 'Hinge at hips. Feel the hamstring stretch.',
                    done: false
                }
            ],
            wednesday: [],
            thursday: [
                {
                    id: generateId(),
                    name: 'Pull-ups',
                    sets: '4x8',
                    weight: 'Bodyweight',
                    image: 'https://images.unsplash.com/photo-1598971639058-a25d6df8a97a?w=400&h=200&fit=crop',
                    video: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
                    notes: 'Full dead hang at bottom. Chin over bar.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Barbell Row',
                    sets: '4x10',
                    weight: '135 lbs',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
                    notes: 'Pull to lower chest. Squeeze lats.',
                    done: false
                }
            ],
            friday: [
                {
                    id: generateId(),
                    name: 'Overhead Press',
                    sets: '4x8',
                    weight: '95 lbs',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
                    notes: 'Brace core. Lock out at top.',
                    done: false
                }
            ],
            saturday: [],
            sunday: []
        };
    }

    // Helpers
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function getYouTubeId(url) {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    }

    // Set active day based on today
    function setActiveDay() {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (dayNames[today]) {
            currentDay = today;
        }
        updateDayButtons();
    }

    function updateDayButtons() {
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.day === currentDay);
        });
        dayTitle.textContent = dayNames[currentDay];
    }

    // Render
    function renderExercises() {
        const exercises = routines[currentDay] || [];

        if (exercises.length === 0) {
            exerciseList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏋️</div>
                    <p>No exercises for ${dayNames[currentDay]}.<br>Tap "+ Add Exercise" to get started!</p>
                </div>
            `;
            return;
        }

        const doneCount = exercises.filter(e => e.done).length;
        const progressPercent = Math.round((doneCount / exercises.length) * 100);

        let html = `
            <div class="progress-bar">
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">${doneCount}/${exercises.length} completed</div>
            </div>
        `;

        exercises.forEach(exercise => {
            const ytId = getYouTubeId(exercise.video);
            html += `
                <div class="exercise-card ${exercise.done ? 'completed' : ''}" data-id="${exercise.id}">
                    <div class="exercise-card-header">
                        <h3>${escapeHtml(exercise.name)}</h3>
                        <div class="exercise-actions">
                            <button onclick="app.editExercise('${exercise.id}')" aria-label="Edit">✏️</button>
                            <button onclick="app.deleteExercise('${exercise.id}')" aria-label="Delete">🗑️</button>
                        </div>
                    </div>
                    <div class="exercise-meta">
                        ${exercise.sets ? `<span>📋 ${escapeHtml(exercise.sets)}</span>` : ''}
                        ${exercise.weight ? `<span>🏋️ ${escapeHtml(exercise.weight)}</span>` : ''}
                    </div>
                    ${exercise.image ? `<img class="exercise-image" src="${escapeHtml(exercise.image)}" alt="${escapeHtml(exercise.name)}" loading="lazy" onerror="this.style.display='none'">` : ''}
                    ${exercise.video ? `
                        <a class="exercise-video-link" href="${escapeHtml(exercise.video)}" target="_blank" rel="noopener">
                            ▶️ Watch Tutorial on YouTube
                        </a>
                    ` : ''}
                    ${exercise.notes ? `<p class="exercise-notes">💡 ${escapeHtml(exercise.notes)}</p>` : ''}
                    <div class="exercise-done">
                        <input type="checkbox" id="done-${exercise.id}" ${exercise.done ? 'checked' : ''} onchange="app.toggleDone('${exercise.id}')">
                        <label for="done-${exercise.id}">Mark as done</label>
                    </div>
                </div>
            `;
        });

        exerciseList.innerHTML = html;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Modal
    function openModal(exercise = null) {
        if (exercise) {
            modalTitle.textContent = 'Edit Exercise';
            editingId = exercise.id;
            document.getElementById('exerciseName').value = exercise.name || '';
            document.getElementById('exerciseSets').value = exercise.sets || '';
            document.getElementById('exerciseWeight').value = exercise.weight || '';
            document.getElementById('exerciseImage').value = exercise.image || '';
            document.getElementById('exerciseVideo').value = exercise.video || '';
            document.getElementById('exerciseNotes').value = exercise.notes || '';
        } else {
            modalTitle.textContent = 'Add Exercise';
            editingId = null;
            exerciseForm.reset();
        }
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        editingId = null;
    }

    // CRUD
    function saveExercise(e) {
        e.preventDefault();

        const exercise = {
            id: editingId || generateId(),
            name: document.getElementById('exerciseName').value.trim(),
            sets: document.getElementById('exerciseSets').value.trim(),
            weight: document.getElementById('exerciseWeight').value.trim(),
            image: document.getElementById('exerciseImage').value.trim(),
            video: document.getElementById('exerciseVideo').value.trim(),
            notes: document.getElementById('exerciseNotes').value.trim(),
            done: false
        };

        if (!exercise.name) return;

        if (!routines[currentDay]) routines[currentDay] = [];

        if (editingId) {
            const idx = routines[currentDay].findIndex(ex => ex.id === editingId);
            if (idx !== -1) {
                exercise.done = routines[currentDay][idx].done;
                routines[currentDay][idx] = exercise;
            }
        } else {
            routines[currentDay].push(exercise);
        }

        saveRoutines();
        renderExercises();
        closeModal();
    }

    function editExercise(id) {
        const exercise = routines[currentDay].find(ex => ex.id === id);
        if (exercise) openModal(exercise);
    }

    function deleteExercise(id) {
        if (confirm('Delete this exercise?')) {
            routines[currentDay] = routines[currentDay].filter(ex => ex.id !== id);
            saveRoutines();
            renderExercises();
        }
    }

    function toggleDone(id) {
        const exercise = routines[currentDay].find(ex => ex.id === id);
        if (exercise) {
            exercise.done = !exercise.done;
            saveRoutines();
            renderExercises();
        }
    }

    // Events
    function bindEvents() {
        themeToggle.addEventListener('click', toggleTheme);

        daySelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.day-btn');
            if (btn) {
                currentDay = btn.dataset.day;
                updateDayButtons();
                renderExercises();
            }
        });

        addExerciseBtn.addEventListener('click', () => openModal());
        modalClose.addEventListener('click', closeModal);
        btnCancel.addEventListener('click', closeModal);
        exerciseForm.addEventListener('submit', saveExercise);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Public API for inline handlers
    window.app = {
        editExercise,
        deleteExercise,
        toggleDone
    };

    // Start
    init();
})();
