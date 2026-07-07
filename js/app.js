// LocalVibe (পাড়া কানেক্ট) Application Logic

class LocalVibeApp {
    constructor() {
        this.currentLang = localStorage.getItem("localvibe_lang") || "bn";
        this.currentTheme = localStorage.getItem("localvibe_theme") || "light";
        this.currentView = "home"; // 'home', 'map', 'leaderboard', 'settings'
        this.currentFoodFilter = "all";
        this.currentStatusFilter = "all";
        this.searchQuery = "";
        
        this.selectedLat = null;
        this.selectedLng = null;
        this.tempMarker = null;
        this.map = null;
        this.markersGroup = null;

        // Init elements
        this.initDomElements();
        
        // Initialize Theme & Lang
        this.initThemeAndLanguage();

        // Populate location dropdowns in form
        this.initLocationDropdowns();

        // Load data
        this.posts = StorageManager.getPosts();
        this.contributors = StorageManager.getContributors();

        // Initialize Map
        this.initMap();

        // Bind events
        this.bindEvents();

        // Initial render
        this.updateLocalization();
        this.renderPosts();
        this.renderLeaderboard();
        this.switchView(this.currentView);

        // Bind Firebase Sync
        this.initFirebaseSync();
    }

    initFirebaseSync() {
        if (!window.firebaseDb) {
            window.addEventListener("firebase-ready", () => this.initFirebaseSync());
            return;
        }

        const db = window.firebaseDb;
        const { collection, onSnapshot } = window.firestoreLib;

        // Real-time listener for posts
        const postsCol = collection(db, "posts");
        onSnapshot(postsCol, (snapshot) => {
            let fbPosts = [];
            snapshot.forEach(docSnap => {
                fbPosts.push({ id: docSnap.id, ...docSnap.data() });
            });

            if (fbPosts.length === 0) {
                this.seedFirestore();
            } else {
                fbPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                this.posts = fbPosts;
                StorageManager.savePosts(fbPosts);
                this.renderPosts();
            }
        });

        // Real-time listener for contributors
        const contribCol = collection(db, "contributors");
        onSnapshot(contribCol, (snapshot) => {
            let fbContribs = [];
            snapshot.forEach(docSnap => {
                fbContribs.push({ ...docSnap.data() });
            });

            if (fbContribs.length > 0) {
                fbContribs.sort((a, b) => b.points - a.points);
                this.contributors = fbContribs;
                localStorage.setItem("localvibe_contributors", JSON.stringify(fbContribs));
                this.renderLeaderboard();
            }
        });
    }

    async seedFirestore() {
        const db = window.firebaseDb;
        const { collection, addDoc } = window.firestoreLib;
        const postsCol = collection(db, "posts");
        for (const post of DEFAULT_POSTS) {
            const { id, ...postData } = post;
            await addDoc(postsCol, postData);
        }
    }

    initDomElements() {
        // Navigation & Views
        this.bottomNavButtons = document.querySelectorAll(".bottom-nav-btn");
        this.homeView = document.getElementById("home-view-panel");
        this.leaderboardView = document.getElementById("leaderboard-view-panel");
        this.settingsView = document.getElementById("settings-view-panel");
        this.mapPanel = document.getElementById("map-panel");
        this.sidebarFilters = document.getElementById("sidebar-filters");

        // Controls
        this.searchInput = document.getElementById("search-input");
        this.statusFilter = document.getElementById("status-filter");
        this.btnOpenModal = document.getElementById("btn-open-modal");
        
        // Settings elements
        this.themeSelect = document.getElementById("settings-theme-select");
        this.langSelect = document.getElementById("settings-lang-select");

        // Form elements
        this.modalOverlay = document.getElementById("modal-overlay");
        this.modalForm = document.getElementById("add-post-form");
        this.btnCloseModal = document.getElementById("btn-close-modal");
        this.btnCancelModal = document.getElementById("btn-cancel-modal");
        
        this.districtSelect = document.getElementById("district-select");
        this.upazilaSelect = document.getElementById("upazila-select");
        
        this.anonymousToggle = document.getElementById("anonymous-toggle");
        this.reporterNameGroup = document.getElementById("reporter-name-group");
        
        this.inputEventTitle = document.getElementById("event-title-input");
        this.inputVenueName = document.getElementById("venue-name-input");
        this.selectCategory = document.getElementById("category-select");
        this.inputDistTime = document.getElementById("dist-time-input");
        this.textareaDetails = document.getElementById("details-input");
        this.inputReporterName = document.getElementById("reporter-name-input");

        // List containers
        this.feedContainer = document.getElementById("feed-container");
        this.leaderboardBody = document.getElementById("leaderboard-body");
        this.pills = document.querySelectorAll(".food-filter-pills .pill");
    }

    initThemeAndLanguage() {
        if (this.currentTheme === "dark") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
        this.themeSelect.value = this.currentTheme;
        this.langSelect.value = this.currentLang;
        localStorage.setItem("localvibe_lang", this.currentLang);
    }

    initLocationDropdowns() {
        const dict = TRANSLATIONS[this.currentLang];
        
        this.districtSelect.innerHTML = `<option value="" disabled selected>${dict.districtPlaceholder}</option>`;
        
        BANGLADESH_DISTRICTS.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.name;
            opt.textContent = this.currentLang === "bn" ? d.bn_name : d.name;
            this.districtSelect.appendChild(opt);
        });

        this.districtSelect.addEventListener("change", (e) => {
            const selectedDist = e.target.value;
            this.upazilaSelect.innerHTML = `<option value="" disabled selected>${dict.upazilaPlaceholder}</option>`;
            
            if (BANGLADESH_LOCATIONS[selectedDist]) {
                this.upazilaSelect.disabled = false;
                BANGLADESH_LOCATIONS[selectedDist].forEach(upz => {
                    const opt = document.createElement("option");
                    opt.value = upz.name;
                    opt.textContent = this.currentLang === "bn" ? upz.bn_name : upz.name;
                    this.upazilaSelect.appendChild(opt);
                });
            } else {
                this.upazilaSelect.disabled = true;
            }
        });
    }

    initMap() {
        this.map = L.map('map', {
            zoomControl: false
        }).setView([23.755, 90.385], 13);

        L.control.zoom({ position: 'topright' }).addTo(this.map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        document.querySelector('.leaflet-tile-container').classList.add('dark-leaflet-tiles');
        this.markersGroup = L.layerGroup().addTo(this.map);
        setTimeout(() => { this.map.invalidateSize(); }, 500);
    }

    bindEvents() {
        // Settings Toggles
        this.themeSelect.addEventListener("change", (e) => {
            this.currentTheme = e.target.value;
            localStorage.setItem("localvibe_theme", this.currentTheme);
            if (this.currentTheme === "dark") {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
        });

        this.langSelect.addEventListener("change", (e) => {
            this.currentLang = e.target.value;
            localStorage.setItem("localvibe_lang", this.currentLang);
            this.updateLocalization();
            this.initLocationDropdowns();
            this.renderPosts();
            this.renderLeaderboard();
        });

        // Bottom Nav switcher
        this.bottomNavButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-target");
                this.switchView(target);
            });
        });

        // Search inputs
        this.searchInput.addEventListener("input", (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderPosts();
        });

        this.statusFilter.addEventListener("change", (e) => {
            this.currentStatusFilter = e.target.value;
            this.renderPosts();
        });

        this.pills.forEach(pill => {
            pill.addEventListener("click", () => {
                this.pills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                this.currentFoodFilter = pill.getAttribute("data-food");
                this.renderPosts();
            });
        });

        // Anonymous toggle
        this.anonymousToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                this.reporterNameGroup.style.display = "none";
                this.inputReporterName.value = ""; // clear name
            } else {
                this.reporterNameGroup.style.display = "flex";
            }
        });



        // Open modal
        this.btnOpenModal.addEventListener("click", () => {
            this.modalOverlay.classList.add("active");
        });

        const closeModal = () => {
            this.modalOverlay.classList.remove("active");
            this.modalForm.reset();
            this.upazilaSelect.disabled = true;
            this.reporterNameGroup.style.display = "flex";
            if (this.tempMarker) {
                this.map.removeLayer(this.tempMarker);
                this.tempMarker = null;
            }
            this.selectedLat = null;
            this.selectedLng = null;
        };

        this.btnCloseModal.addEventListener("click", closeModal);
        this.btnCancelModal.addEventListener("click", closeModal);

        // Map Click selectors
        this.map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            this.selectedLat = lat;
            this.selectedLng = lng;
            


            if (this.tempMarker) {
                this.map.removeLayer(this.tempMarker);
            }

            const tempIcon = L.divIcon({
                className: 'custom-pin',
                html: `<div class="pin-wrapper sports" style="animation: pulse-glow 1.5s infinite alternate;"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            this.tempMarker = L.marker([lat, lng], { icon: tempIcon }).addTo(this.map);

            if (!this.modalOverlay.classList.contains("active")) {
                this.modalOverlay.classList.add("active");
            }
        });

        // Submit form
        this.modalForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const district = this.districtSelect.value;
            const upazila = this.upazilaSelect.value;

            if (!district || !upazila) {
                alert(TRANSLATIONS[this.currentLang].locationAlert);
                return;
            }

            // Latitude / Longitude fallback configurations
            let lat = null;
            let lng = null;

            if (this.selectedLat && this.selectedLng) {
                lat = this.selectedLat;
                lng = this.selectedLng;
            } else if (REGION_COORDINATES[district]) {
                // Fallback to District center
                lat = REGION_COORDINATES[district].lat;
                lng = REGION_COORDINATES[district].lng;
            } else {
                // Final fallback center
                lat = 23.755;
                lng = 90.385;
            }

            const title = this.inputEventTitle.value.trim();
            const venueName = this.inputVenueName.value.trim();
            const category = this.selectCategory.value;
            const distTime = this.inputDistTime.value.trim();
            const details = this.textareaDetails.value.trim();
            
            // Anonymous check
            const isAnonymous = this.anonymousToggle.checked;
            const reporter = isAnonymous 
                ? (this.currentLang === "bn" ? "বেনামী কন্ট্রিবিউটর" : "Anonymous Contributor")
                : (this.inputReporterName.value.trim() || (this.currentLang === "bn" ? "বেনামী ইউজার" : "Anonymous User"));

            const newPost = {
                id: "post-" + Date.now(),
                title,
                venueName,
                category,
                district,
                upazila,
                distributionTime: distTime,
                details,
                lat,
                lng,
                upvotes: 1,
                flags: 0,
                status: "today",
                reporterName: reporter,
                date: new Date().toISOString(),
                comments: []
            };

            if (window.firebaseDb) {
                const db = window.firebaseDb;
                const { collection, addDoc } = window.firestoreLib;
                const postsCol = collection(db, "posts");
                const { id, ...postData } = newPost;
                addDoc(postsCol, postData).then(() => {
                    StorageManager.addPointsToUser(newPost.reporterName, 20);
                    this.showToast(TRANSLATIONS[this.currentLang].toastSuccess);
                }).catch(err => {
                    console.error("Firebase post failed:", err);
                    this.posts = StorageManager.addPost(newPost);
                    this.renderPosts();
                });
            } else {
                this.posts = StorageManager.addPost(newPost);
                this.contributors = StorageManager.getContributors();
                this.renderPosts();
                this.renderLeaderboard();
                this.showToast(TRANSLATIONS[this.currentLang].toastSuccess);
            }
            
            closeModal();
            this.map.flyTo([newPost.lat, newPost.lng], 15);
        });
    }

    switchView(view) {
        this.currentView = view;
        this.bottomNavButtons.forEach(btn => btn.classList.remove("active"));
        
        this.homeView.style.display = "none";
        this.leaderboardView.style.display = "none";
        this.settingsView.style.display = "none";
        this.sidebarFilters.style.display = "none";

        const activeBtn = Array.from(this.bottomNavButtons).find(btn => btn.getAttribute("data-target") === view);
        if (activeBtn) activeBtn.classList.add("active");

        if (view === "home" || view === "home-view") {
            this.homeView.style.display = "flex";
            this.sidebarFilters.style.display = "flex";
            if (window.innerWidth <= 900) {
                this.mapPanel.style.display = "block";
            }
            setTimeout(() => this.map.invalidateSize(), 100);
        } else if (view === "settings" || view === "settings-view") {
            this.settingsView.style.display = "block";
        }
    }

    updateLocalization() {
        const dict = TRANSLATIONS[this.currentLang];
        
        document.querySelector(".brand-title").textContent = dict.title;
        document.querySelector(".brand-subtitle").textContent = dict.subtitle;

        // Bottom nav
        document.getElementById("nav-lbl-feed").textContent = dict.navHome;
        document.getElementById("nav-lbl-map").textContent = dict.navMap;
        document.getElementById("nav-lbl-leaderboard").textContent = dict.navLeaderboard;
        document.getElementById("nav-lbl-settings").textContent = dict.navSettings;

        this.searchInput.placeholder = dict.searchPlaceholder;
        document.getElementById("btn-open-modal").querySelector("span").textContent = dict.addPostBtn;
        
        // Pills
        document.querySelector('[data-food="all"]').textContent = dict.filterAll;
        document.querySelector('[data-food="food"]').textContent = dict.filterFood;
        document.querySelector('[data-food="sports"]').textContent = dict.filterSports;
        document.querySelector('[data-food="religious"]').textContent = dict.filterReligious;
        document.querySelector('[data-food="community"]').textContent = dict.filterCommunity;
        document.querySelector('[data-food="announcement"]').textContent = dict.filterAnnouncement;
        document.querySelector('[data-food="culture"]').textContent = dict.filterCulture;

        this.statusFilter.options[0].textContent = dict.statusAll;
        this.statusFilter.options[1].textContent = dict.statusToday;
        this.statusFilter.options[2].textContent = dict.statusUpcoming;
        this.statusFilter.options[3].textContent = dict.statusPast;

        document.getElementById("leaderboard-title").textContent = dict.leaderboardTitle;
        document.getElementById("leaderboard-subtitle").textContent = dict.leaderboardSubtitle;
        document.getElementById("th-rank").textContent = dict.rank;
        document.getElementById("th-contrib").textContent = dict.contributor;
        document.getElementById("th-points").textContent = dict.points;
        document.getElementById("th-verif").textContent = dict.verifications;

        // Settings View labels
        document.getElementById("settings-title-text").textContent = dict.settingsTitle;
        document.getElementById("settings-lbl-theme").textContent = dict.labelTheme;
        document.getElementById("opt-theme-light").textContent = dict.themeLight;
        document.getElementById("opt-theme-dark").textContent = dict.themeDark;
        document.getElementById("settings-lbl-lang").textContent = dict.labelLanguage;

        // Modal Form labels & Placeholders
        document.getElementById("modal-title-text").textContent = dict.modalTitle;
        document.getElementById("lbl-form-district").textContent = dict.labelSelectDistrictForm;
        document.getElementById("lbl-form-upazila").textContent = dict.labelSelectUpazilaForm;
        

        document.getElementById("lbl-anonymous-text").textContent = dict.labelAnonymous;

        document.getElementById("label-event-title").textContent = dict.labelEventTitle;
        this.inputEventTitle.placeholder = dict.titlePlaceholder;
        document.getElementById("label-venue").textContent = dict.labelVenueName;
        this.inputVenueName.placeholder = dict.venuePlaceholder;
        document.getElementById("label-category").textContent = dict.labelCategory;
        
        document.getElementById("opt-food").textContent = dict.filterFood;
        document.getElementById("opt-sports").textContent = dict.filterSports;
        document.getElementById("opt-religious").textContent = dict.filterReligious;
        document.getElementById("opt-community").textContent = dict.filterCommunity;
        document.getElementById("opt-announcement").textContent = dict.filterAnnouncement;
        document.getElementById("opt-culture").textContent = dict.filterCulture;
        
        document.getElementById("label-time").textContent = dict.labelTime;
        this.inputDistTime.placeholder = dict.timePlaceholder;
        document.getElementById("label-details").textContent = dict.labelDetails;
        this.textareaDetails.placeholder = dict.detailsPlaceholder;
        document.getElementById("label-reporter").textContent = this.currentLang === "bn" ? "আপনার নাম" : "Your Name";
        this.inputReporterName.placeholder = dict.reporterPlaceholder;
        

        this.btnCancelModal.textContent = dict.btnCancel;
        document.getElementById("btn-submit-post").textContent = dict.btnSubmit;
    }

    getAvatarColor(name) {
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#eab308", "#a855f7", "#ec4899", "#14b8a6", "#f97316"];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash % colors.length);
        return colors[index];
    }

    getLocalizedDistrict(districtName) {
        if (this.currentLang === "en") return districtName;
        const d = BANGLADESH_DISTRICTS.find(item => item.name === districtName);
        return d ? d.bn_name : districtName;
    }

    getLocalizedUpazila(districtName, upazilaName) {
        if (this.currentLang === "en") return upazilaName;
        const list = BANGLADESH_LOCATIONS[districtName];
        if (list) {
            const u = list.find(item => item.name === upazilaName);
            return u ? u.bn_name : upazilaName;
        }
        return upazilaName;
    }

    renderPosts() {
        this.feedContainer.innerHTML = "";
        this.markersGroup.clearLayers();

        const dict = TRANSLATIONS[this.currentLang];

        const filtered = this.posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(this.searchQuery) || 
                                 post.venueName.toLowerCase().includes(this.searchQuery) || 
                                 post.details.toLowerCase().includes(this.searchQuery) ||
                                 post.district.toLowerCase().includes(this.searchQuery) ||
                                 post.upazila.toLowerCase().includes(this.searchQuery) ||
                                 post.distributionTime.toLowerCase().includes(this.searchQuery);
            const matchesFood = this.currentFoodFilter === "all" || post.category === this.currentFoodFilter;
            const matchesStatus = this.currentStatusFilter === "all" || post.status === this.currentStatusFilter;

            return matchesSearch && matchesFood && matchesStatus;
        });

        filtered.forEach(post => {
            const card = document.createElement("div");
            card.className = `post-card ${post.category}`;
            
            let categoryText = dict.filterAnnouncement;
            if (post.category === "food") categoryText = dict.filterFood;
            else if (post.category === "sports") categoryText = dict.filterSports;
            else if (post.category === "religious") categoryText = dict.filterReligious;
            else if (post.category === "community") categoryText = dict.filterCommunity;
            else if (post.category === "culture") categoryText = dict.filterCulture;

            const timeAgo = this.formatTimeAgo(post.date);
            const avatarColor = this.getAvatarColor(post.reporterName);
            const initials = post.reporterName.charAt(0);
            
            const hasVoted = StorageManager.hasVoted(post.id);
            const activeClass = hasVoted ? "active" : "";
            const activeText = hasVoted ? dict.verifiedBtnActive : dict.verifyBtn;

            card.innerHTML = `
                <!-- Profile Header -->
                <div class="card-profile-header">
                    <div class="profile-info-block">
                        <div class="user-avatar" style="background-color: ${avatarColor}">${initials}</div>
                        <div class="user-meta">
                            <span class="user-name">${post.reporterName}</span>
                            <span class="post-date">${dict.postTime} ${timeAgo}</span>
                        </div>
                    </div>
                    <div class="category-pill">
                        <span class="category-dot ${post.category}"></span>
                        <span>${categoryText}</span>
                    </div>
                </div>

                <!-- Event Title -->
                <h4 class="event-title">${post.title}</h4>

                <!-- Event Details Grid -->
                <div class="event-details-grid">
                    <div class="detail-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span><b>${this.currentLang === 'bn' ? 'স্থান:' : 'Venue:'}</b> ${post.venueName} (${this.getLocalizedDistrict(post.district)} > ${this.getLocalizedUpazila(post.district, post.upazila)})</span>
                    </div>
                    <div class="detail-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span><b>${this.currentLang === 'bn' ? 'সময়:' : 'Time:'}</b> ${post.distributionTime}</span>
                    </div>
                </div>

                <!-- Description -->
                ${post.details ? `<p class="card-details">${post.details}</p>` : ''}
                
                <!-- Stats bar -->
                <div class="card-stats-bar">
                    <span>${post.upvotes} ${dict.verifiedCount}</span>
                    <span>${post.comments ? post.comments.length : 0} ${this.currentLang === 'bn' ? 'টি মন্তব্য' : 'comments'}</span>
                </div>

                <!-- Action row -->
                <div class="card-actions">
                    <button class="btn-action-social verify-btn ${activeClass}" data-id="${post.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>${activeText}</span>
                    </button>
                    <button class="btn-action-social comment-btn" data-id="${post.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>${this.currentLang === 'bn' ? 'মন্তব্য' : 'Comment'}</span>
                    </button>
                    <button class="btn-action-social flag-btn" data-id="${post.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                        <span>${dict.flagBtn}</span>
                    </button>
                </div>

                <!-- Collapsible comments -->
                <div class="comments-panel" id="comments-${post.id}">
                    <div class="comments-list">
                        ${post.comments && post.comments.length > 0 ? 
                            post.comments.map(c => `
                                <div class="comment-item">
                                    <span class="comment-author">${c.author}:</span>
                                    <span class="comment-text">${c.text}</span>
                                </div>
                            `).join('') : `<div style="font-size:0.75rem; color:var(--color-text-muted); padding:4px 0;">No comments yet</div>`
                        }
                    </div>
                    <div class="comment-input-row">
                        <input type="text" class="comment-input" placeholder="${dict.addCommentPlaceholder}">
                        <button class="btn-submit-comment" data-id="${post.id}">💬</button>
                    </div>
                </div>
            `;

            this.feedContainer.appendChild(card);

            card.querySelector(".verify-btn").addEventListener("click", () => {
                if (window.firebaseDb) {
                    const db = window.firebaseDb;
                    const { doc, updateDoc, increment } = window.firestoreLib;
                    const postRef = doc(db, "posts", post.id);
                    
                    const hasVoted = StorageManager.hasVoted(post.id);
                    if (hasVoted) {
                        updateDoc(postRef, { upvotes: increment(-1) }).then(() => {
                            StorageManager.toggleLocalVote(post.id, 'removed', post.reporterName);
                            this.showToast(dict.toastUnverified, "warning");
                        });
                    } else {
                        updateDoc(postRef, { upvotes: increment(1) }).then(() => {
                            StorageManager.toggleLocalVote(post.id, 'added', post.reporterName);
                            this.showToast(dict.toastVerified);
                        });
                    }
                } else {
                    const result = StorageManager.upvotePost(post.id);
                    this.posts = result.posts;
                    this.contributors = StorageManager.getContributors();
                    this.renderPosts();
                    this.renderLeaderboard();
                    
                    if (result.state === 'added') {
                        this.showToast(dict.toastVerified);
                    } else {
                        this.showToast(dict.toastUnverified, "warning");
                    }
                }
            });

            card.querySelector(".flag-btn").addEventListener("click", () => {
                if (window.firebaseDb) {
                    const db = window.firebaseDb;
                    const { doc, updateDoc, increment } = window.firestoreLib;
                    const postRef = doc(db, "posts", post.id);
                    updateDoc(postRef, { flags: increment(1) }).then(() => {
                        this.showToast(dict.toastFlagged, "error");
                    });
                } else {
                    this.posts = StorageManager.flagPost(post.id);
                    this.renderPosts();
                    this.showToast(dict.toastFlagged, "error");
                }
            });

            const commentBtn = card.querySelector(".comment-btn");
            const panel = card.querySelector(`.comments-panel`);
            commentBtn.addEventListener("click", () => {
                panel.classList.toggle("active");
            });

            card.querySelector(".btn-submit-comment").addEventListener("click", () => {
                const commentInput = card.querySelector(".comment-input");
                const text = commentInput.value.trim();
                if (text) {
                    const commenter = this.currentLang === "bn" ? "ইউজার" : "User";
                    const newComment = {
                        author: commenter,
                        text: text,
                        timestamp: new Date().toISOString()
                    };

                    if (window.firebaseDb) {
                        const db = window.firebaseDb;
                        const { doc, updateDoc, arrayUnion } = window.firestoreLib;
                        const postRef = doc(db, "posts", post.id);
                        updateDoc(postRef, {
                            comments: arrayUnion(newComment)
                        }).then(() => {
                            commentInput.value = "";
                        });
                    } else {
                        this.posts = StorageManager.addComment(post.id, newComment);
                        this.renderPosts();
                    }
                }
            });

            // Map markers icons placement
            let iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>`;
            if (post.category === "food") {
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11v9h18v-9c0-4.97-4.03-9-9-9z"/></svg>`;
            } else if (post.category === "sports") {
                iconSvg = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/></svg>`;
            } else if (post.category === "religious") {
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c3.95 0 7.31-2.29 8.93-5.61-4.88-.13-8.8-4.05-8.93-8.93C8.48 11.23 6.2 14.59 6.2 18.53z"/></svg>`;
            } else if (post.category === "community") {
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            } else if (post.category === "culture") {
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
            }

            const customIcon = L.divIcon({
                className: 'custom-pin',
                html: `<div class="pin-wrapper ${post.category}">${iconSvg}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            const marker = L.marker([post.lat, post.lng], { icon: customIcon }).addTo(this.markersGroup);
            
            const popupContent = `
                <div style="font-family: var(--font-family); color: var(--color-text-primary); min-width: 160px; padding: 2px;">
                    <b style="font-size:0.95rem;">${post.title}</b><br>
                    <span style="color:var(--color-sports); font-size:0.8rem; font-weight:bold;">${categoryText}</span><br>
                    <span style="font-size:0.75rem; color:var(--color-text-secondary);">${post.distributionTime}</span><br>
                    <a href="#" class="popup-link-btn" id="zoom-card-${post.id}">${this.currentLang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}</a>
                </div>
            `;
            marker.bindPopup(popupContent);

            marker.on('popupopen', () => {
                const zoomBtn = document.getElementById(`zoom-card-${post.id}`);
                if (zoomBtn) {
                    zoomBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        this.switchView('home');
                        card.scrollIntoView({ behavior: "smooth", block: "center" });
                        card.style.borderColor = "var(--color-sports)";
                        setTimeout(() => {
                            card.style.borderColor = "var(--color-border)";
                        }, 2000);
                    });
                }
            });
        });
    }

    renderLeaderboard() {
        this.leaderboardBody.innerHTML = "";
        this.contributors.forEach((c, idx) => {
            const tr = document.createElement("tr");
            const rankClass = idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : "rank-other";
            
            tr.innerHTML = `
                <td><span class="rank-badge ${rankClass}">${idx + 1}</span></td>
                <td><span class="contributor-name">${c.name}</span></td>
                <td><span class="contributor-points">${c.points} XP</span></td>
                <td>${c.verifications}</td>
            `;
            this.leaderboardBody.appendChild(tr);
        });
    }

    formatTimeAgo(isoString) {
        const date = new Date(isoString);
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (this.currentLang === "bn") {
            if (seconds < 60) return "এইমাত্র";
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes} মিনিট আগে`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} ঘণ্টা আগে`;
            const days = Math.floor(hours / 24);
            return `${days} দিন আগে`;
        } else {
            if (seconds < 60) return "just now";
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        }
    }

    showToast(message, type = "success") {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast ${type === "error" ? "toast-error" : type === "warning" ? "toast-warning" : ""}`;
        toast.innerHTML = `
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = "slide-in 0.2s reverse forwards";
            setTimeout(() => toast.remove(), 200);
        }, 3000);
    }
}

// Instantiate on load
window.addEventListener("DOMContentLoaded", () => {
    window.app = new LocalVibeApp();
});
