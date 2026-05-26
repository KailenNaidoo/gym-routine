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
    let dayMeta = loadDayMeta();

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
        const saved = localStorage.getItem('gym-theme') || 'dark';
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
        const saved = localStorage.getItem('gym-routines-v2');
        if (saved) return JSON.parse(saved);
        return getDefaultRoutines();
    }

    function loadDayMeta() {
        const saved = localStorage.getItem('gym-daymeta-v2');
        if (saved) return JSON.parse(saved);
        return getDefaultDayMeta();
    }

    function saveRoutines() {
        localStorage.setItem('gym-routines-v2', JSON.stringify(routines));
    }

    function saveDayMeta() {
        localStorage.setItem('gym-daymeta-v2', JSON.stringify(dayMeta));
    }

    function getDefaultDayMeta() {
        return {
            monday: {
                phase: 'Veg-Fast',
                calories: 1535,
                protein: 60,
                trainingType: 'Rest / Active Recovery',
                location: 'N/A',
                duration: 0,
                dietRules: ['Strictly plant-based/vegetarian', 'No meat, no dairy', 'High volume green vegetables'],
                supplements: 'Creatine 5g in Full Activate Bottle'
            },
            tuesday: {
                phase: 'Veg-Fast',
                calories: 1535,
                protein: 60,
                trainingType: 'Solo Gym Session (No Sparring)',
                location: 'Gym Floor & Heavy Bag Area',
                duration: 45,
                dietRules: ['Strictly plant-based/vegetarian', 'No meat, no dairy', 'Pre-workout hydration focus'],
                supplements: 'Creatine 5g in Full Activate Bottle'
            },
            wednesday: {
                phase: 'Normal Fueling',
                calories: 1700,
                protein: 110,
                trainingType: 'Rest Day / Muscle Refueling',
                location: 'N/A',
                duration: 0,
                dietRules: ['Refuel depleted glycogen', 'High protein', 'Key meals: Chicken & rice lunch, PB/Banana/Yogurt smoothie snack'],
                supplements: 'Creatine 5g in Full Activate Bottle',
                trackingAction: 'Take morning progress photo after shower (True Baseline)'
            },
            thursday: {
                phase: 'Normal Fueling',
                calories: 1700,
                protein: 110,
                trainingType: 'Home Skill Session',
                location: 'Home / Mirror Space',
                duration: 35,
                dietRules: ['Consistent protein spacing', 'Balanced clean carbs'],
                supplements: 'Creatine 5g in Full Activate Bottle'
            },
            friday: {
                phase: 'Training Fuel',
                calories: 1700,
                protein: 120,
                trainingType: 'Kickboxing Class',
                location: 'Dojo / Fight Gym',
                duration: 60,
                dietRules: ['Increase carbs slightly before class', 'High hydration post-workout'],
                supplements: 'Creatine 5g in Full Activate Bottle'
            },
            saturday: {
                phase: 'Normal Fueling',
                calories: 1600,
                protein: 100,
                trainingType: 'Rest Day',
                location: 'N/A',
                duration: 0,
                dietRules: ['Maintenance recovery profile', 'Keep protein stable'],
                supplements: 'Creatine 5g in Full Activate Bottle'
            },
            sunday: {
                phase: 'Normal Fueling',
                calories: 1600,
                protein: 100,
                trainingType: 'Active Recovery / Outdoor Rest',
                location: 'Optional Trail / Outdoor Space',
                duration: 60,
                dietRules: ['Meal prep day', 'Source fresh vegetables for Monday fast'],
                supplements: 'Creatine 5g in Full Activate Bottle'
            }
        };
    }

    function getDefaultRoutines() {
        return {
            monday: [],
            tuesday: [
                {
                    id: generateId(),
                    name: 'Skipping Rope / Light Jogging',
                    sets: '',
                    weight: '',
                    section: 'Warm-up',
                    duration: '10 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=u3zgHI8QnqE',
                    notes: 'Get heart rate up, loosen joints',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Range Finder',
                    sets: '',
                    weight: '',
                    section: 'Heavy Bag Round 1',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=bVbJhMjPUI4',
                    notes: 'Straight jabs, crosses, teeps. 16oz Gloves.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Power Combinations',
                    sets: '',
                    weight: '',
                    section: 'Heavy Bag Round 2',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=GhGSzy9QXOM',
                    notes: 'Jab-Cross-Hook-Low Kick. 16oz Gloves.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Inside Combat',
                    sets: '',
                    weight: '',
                    section: 'Heavy Bag Round 3',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=eMVqEbGSFkU',
                    notes: 'Hooks, uppercuts, angles. 16oz Gloves.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Kick Engine',
                    sets: '',
                    weight: '',
                    section: 'Heavy Bag Round 4',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=XzAVNKFQ3gQ',
                    notes: 'Alternate roundhouses, balance focus. 16oz Gloves.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'The Burnout',
                    sets: '',
                    weight: '',
                    section: 'Heavy Bag Round 5',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=XLmDMFnMfbM',
                    notes: 'Rapid-fire punches/kicks non-stop. 16oz Gloves.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Lying Leg Raises',
                    sets: '3x15',
                    weight: '',
                    section: 'Core Circuit',
                    duration: '',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
                    notes: 'Keep lower back pressed to floor. Controlled movement.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Plank Hold',
                    sets: '',
                    weight: '',
                    section: 'Core Finisher',
                    duration: '1 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
                    notes: 'Tight core, neutral spine. Breathe steady.',
                    done: false
                }
            ],
            wednesday: [],
            thursday: [
                {
                    id: generateId(),
                    name: 'Shadowboxing R1',
                    sets: '',
                    weight: '',
                    section: 'Shadowboxing',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=ixkFHNBQPOo',
                    notes: 'Pure footwork, head movement, quick jabs.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Shadowboxing R2',
                    sets: '',
                    weight: '',
                    section: 'Shadowboxing',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=ixkFHNBQPOo',
                    notes: 'Adding combinations, hip rotation for air kicks.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Shadowboxing R3',
                    sets: '',
                    weight: '',
                    section: 'Shadowboxing',
                    duration: '3 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=ixkFHNBQPOo',
                    notes: 'Full tactical pace — imagine opponent.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Strength Circuit',
                    sets: '3 rounds',
                    weight: 'Bodyweight',
                    section: 'Strength',
                    duration: '',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
                    notes: 'Push-ups (15), Bodyweight Squats (20), Plank (45s). Repeat 3x.',
                    done: false
                }
            ],
            friday: [
                {
                    id: generateId(),
                    name: 'Class Warm-up',
                    sets: '',
                    weight: '',
                    section: 'Warm-up',
                    duration: '15 min',
                    image: '',
                    video: '',
                    notes: 'High-intensity cardio & skipping.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Partner Drills',
                    sets: '',
                    weight: '',
                    section: 'Drills',
                    duration: '25 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=ZnYVLyqiR0c',
                    notes: 'Combinations, pad work, explosive target training.',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Tactical Phase',
                    sets: '',
                    weight: '',
                    section: 'Defense',
                    duration: '15 min',
                    image: '',
                    video: 'https://www.youtube.com/watch?v=DfXE6UVNjuQ',
                    notes: 'Defensive slips, intercepting drills (Teeps/Jabs).',
                    done: false
                },
                {
                    id: generateId(),
                    name: 'Conditioning Blowout',
                    sets: '',
                    weight: '',
                    section: 'Conditioning',
                    duration: '5 min',
                    image: '',
                    video: '',
                    notes: 'Dojo blowout circuit — Core/Bag burnout.',
                    done: false
                }
            ],
            saturday: [],
            sunday: [
                {
                    id: generateId(),
                    name: 'Light Hiking / Walking',
                    sets: '',
                    weight: '',
                    section: 'Active Recovery',
                    duration: '60 min',
                    image: '',
                    video: '',
                    notes: 'Optional light hiking or walking to keep active.',
                    done: false
                }
            ]
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
        const meta = dayMeta[currentDay] || {};

        let html = '';

        // Day info card
        html += `
            <div class="day-info-card">
                <div class="day-info-header">
                    <span class="phase-badge">${escapeHtml(meta.phase || '')}</span>
                    <span class="training-type">${escapeHtml(meta.trainingType || '')}</span>
                </div>
                <div class="day-info-stats">
                    <div class="stat">
                        <span class="stat-value">${meta.calories || 0}</span>
                        <span class="stat-label">kcal</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${meta.protein || 0}g</span>
                        <span class="stat-label">protein</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${meta.duration || 0}</span>
                        <span class="stat-label">min</span>
                    </div>
                </div>
                ${meta.location && meta.location !== 'N/A' ? `<div class="day-info-location">📍 ${escapeHtml(meta.location)}</div>` : ''}
                <div class="day-info-diet">
                    <span class="diet-label">🥗 Diet:</span>
                    ${(meta.dietRules || []).map(r => `<span class="diet-tag">${escapeHtml(r)}</span>`).join('')}
                </div>
                <div class="day-info-supps">💊 ${escapeHtml(meta.supplements || '')}</div>
                ${meta.trackingAction ? `<div class="day-info-tracking">📸 ${escapeHtml(meta.trackingAction)}</div>` : ''}
            </div>
        `;

        if (exercises.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-icon">🧘</div>
                    <p>Rest day — recover and refuel.<br>No training scheduled.</p>
                </div>
            `;
            exerciseList.innerHTML = html;
            return;
        }

        const doneCount = exercises.filter(e => e.done).length;
        const progressPercent = Math.round((doneCount / exercises.length) * 100);

        html += `
            <div class="progress-bar">
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">${doneCount}/${exercises.length} completed</div>
            </div>
        `;

        let lastSection = '';
        exercises.forEach(exercise => {
            // Section divider
            if (exercise.section && exercise.section !== lastSection) {
                html += `<div class="section-divider">${escapeHtml(exercise.section)}</div>`;
                lastSection = exercise.section;
            }

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
                        ${exercise.duration ? `<span>⏱️ ${escapeHtml(exercise.duration)}</span>` : ''}
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
            document.getElementById('exerciseDuration').value = exercise.duration || '';
            document.getElementById('exerciseSection').value = exercise.section || '';
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
            duration: document.getElementById('exerciseDuration').value.trim(),
            section: document.getElementById('exerciseSection').value.trim(),
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
