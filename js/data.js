// LocalVibe (পাড়া কানেক্ট) Data and Localization Layer

const TRANSLATIONS = {
    bn: {
        title: "এলাকা",
        subtitle: "পাড়া কানেক্ট - আপনার এলাকার সব খবরাখবর ও অনুষ্ঠান এক জায়গায়!",
        navHome: "ফিড",
        navMap: "মানচিত্র",
        navLeaderboard: "সেরা",
        navSettings: "সেটিংস",
        searchPlaceholder: "অনুষ্ঠান, স্থান বা এলাকা দিয়ে খুঁজুন...",
        filterAll: "সব ইভেন্ট",
        filterFood: "খাবার/তাবাররক",
        filterSports: "খেলাধুলা",
        filterReligious: "ধর্মীয়",
        filterCommunity: "সামাজিক",
        filterAnnouncement: "ঘোষণা/সতর্কতা",
        filterCulture: "সংস্কৃতি/মেলা",
        statusAll: "সব সময়",
        statusToday: "আজকে",
        statusUpcoming: "আসন্ন",
        statusPast: "অতীত",
        verifiedCount: "জন নিশ্চিত করেছেন",
        verifyBtn: "হ্যাঁ, সত্যি!",
        verifiedBtnActive: "নিশ্চিত করেছেন",
        flagBtn: "ভুল তথ্য",
        postTime: "পোস্ট করা হয়েছে:",
        addedBy: "পোস্ট করেছেন:",
        addPostBtn: "পোস্ট করুন",
        modalTitle: "নতুন ইভেন্ট শেয়ার করুন",
        labelEventTitle: "ইভেন্ট/অনুষ্ঠানের নাম *",
        labelVenueName: "স্থান/ঠিকানা *",
        labelCategory: "ক্যাটাগরি *",
        labelTime: "অনুষ্ঠানের সময় *",
        labelDetails: "বিস্তারিত বিবরণ (অপশনাল)",
        labelMapInstruction: "মানচিত্রে স্থানটি চিহ্নিত করতে ক্লিক করুন (অপশনাল)",
        btnSubmit: "পোস্ট করুন",
        btnCancel: "বাতিল",
        toastSuccess: "ইভেন্ট সফলভাবে শেয়ার করা হয়েছে!",
        toastVerified: "আপনি তথ্যটি নিশ্চিত করেছেন!",
        toastUnverified: "ভেরিফিকেশন প্রত্যাহার করা হয়েছে।",
        toastFlagged: "ভুল তথ্য হিসেবে রিপোর্ট করা হয়েছে।",
        toastGeolocateError: "আপনার ডিভাইস থেকে জিপিএস লোকেশন পাওয়া যায়নি।",
        toastGeolocateSuccess: "সফলভাবে জিপিএস অবস্থান সনাক্ত করা হয়েছে!",
        leaderboardTitle: "সেরা লোকাল কন্ট্রিবিউটর",
        leaderboardSubtitle: "সঠিক ও ভেরিফাইড তথ্য শেয়ার করে এলাকার সবাইকে সাহায্য করুন",
        rank: "র‍্যাংক",
        contributor: "কন্ট্রিবিউটর",
        points: "পয়েন্ট",
        verifications: "ভেরিফিকেশন",
        commentsTitle: "মন্তব্যসমূহ",
        addCommentPlaceholder: "মন্তব্য লিখুন...",
        btnComment: "মন্তব্য দিন",
        addressLabel: "ঠিকানা/অবস্থান",
        selectLocationAlert: "অনুগ্রহ করে মানচিত্রে সঠিক অবস্থানটি সিলেক্ট করুন!",
        
        // Form Placeholders
        titlePlaceholder: "যেমন: পাড়ার ফ্রেন্ডলি ফুটবল ম্যাচ / ফ্রিতে জিলাপি দিচ্ছে",
        venuePlaceholder: "যেমন: সোবহানবাগ খেলার মাঠ / ৩ নং গলি",
        timePlaceholder: "যেমন: আজ আছর নামাজের পর / বিকেল ৪:০০ টা",
        detailsPlaceholder: "যেমন: ইভেন্ট সম্পর্কে প্রয়োজনীয় বিবরণ এখানে লিখুন...",
        reporterPlaceholder: "আপনার নাম লিখুন...",
        
        // Settings Translations
        settingsTitle: "অ্যাপ সেটিংস (Settings)",
        labelTheme: "থিম সিলেক্ট করুন (Theme)",
        themeLight: "লাইট থিম (Light Mode)",
        themeDark: "ডার্ক থিম (Dark Mode)",
        labelLanguage: "ভাষা পরিবর্তন করুন (Language)",
        labelSelectDistrict: "জেলা সিলেক্ট করুন (District)",
        labelSelectUpazila: "উপজেলা/এলাকা সিলেক্ট করুন (Upazila)",
        labelSelectDistrictForm: "জেলা (District) *",
        labelSelectUpazilaForm: "উপজেলা/এলাকা (Upazila) *",
        districtPlaceholder: "জেলা সিলেক্ট করুন",
        upazilaPlaceholder: "উপজেলা সিলেক্ট করুন",
        locationAlert: "পোস্ট করতে হলে জেলা এবং উপজেলা নির্বাচন করা বাধ্যতামূলক!",
        
        // Location & Anonymous selectors
        labelGpsBtn: "জিপিএস লোকেশন নিন",
        labelAnonymous: "নাম গোপন রাখুন (পোস্ট করুন বেনামে)"
    },
    en: {
        title: "Elaka",
        subtitle: "Para Connect - All your neighborhood events & news in one place!",
        navHome: "Feed",
        navMap: "Map View",
        navLeaderboard: "Top",
        navSettings: "Settings",
        searchPlaceholder: "Search events, venues, or areas...",
        filterAll: "All Events",
        filterFood: "Food/Tabarrak",
        filterSports: "Sports",
        filterReligious: "Religious",
        filterCommunity: "Community",
        filterAnnouncement: "Alerts/News",
        filterCulture: "Culture/Festivals",
        statusAll: "Anytime",
        statusToday: "Today",
        statusUpcoming: "Upcoming",
        statusPast: "Past",
        verifiedCount: "people confirmed",
        verifyBtn: "Yes, active!",
        verifiedBtnActive: "Confirmed",
        flagBtn: "Wrong Info",
        postTime: "Posted:",
        addedBy: "Reported by:",
        addPostBtn: "Share Event",
        modalTitle: "Share New Local Event",
        labelEventTitle: "Event Title *",
        labelVenueName: "Venue/Location *",
        labelCategory: "Category *",
        labelTime: "Event Time *",
        labelDetails: "Details (Optional)",
        labelMapInstruction: "Click on map to pin coordinates (Optional)",
        btnSubmit: "Submit Post",
        btnCancel: "Cancel",
        toastSuccess: "Successfully shared!",
        toastVerified: "You confirmed this information!",
        toastUnverified: "Verification withdrawn.",
        toastFlagged: "Reported as wrong info.",
        toastGeolocateError: "Could not fetch GPS coordinates from your device.",
        toastGeolocateSuccess: "Successfully fetched GPS location!",
        leaderboardTitle: "Top Local Contributors",
        leaderboardSubtitle: "Helping the neighborhood with correct, verified information",
        rank: "Rank",
        contributor: "Contributor",
        points: "Points",
        verifications: "Verifications",
        commentsTitle: "Comments",
        addCommentPlaceholder: "Write a comment...",
        btnComment: "Comment",
        addressLabel: "Address/Location",
        selectLocationAlert: "Please select a location on the map!",
        
        // Form Placeholders
        titlePlaceholder: "e.g. Friendly Football Match / Free Jilapi Distribution",
        venuePlaceholder: "e.g. Sobhanbagh Field / Lane 3 Crossing",
        timePlaceholder: "e.g. Today after Asr / 4:00 PM onwards",
        detailsPlaceholder: "Write additional event details here...",
        reporterPlaceholder: "Enter your name...",
        
        // Settings Translations
        settingsTitle: "App Settings",
        labelTheme: "Select Theme",
        themeLight: "Light Mode",
        themeDark: "Dark Mode",
        labelLanguage: "Change Language",
        labelSelectDistrict: "Select District",
        labelSelectUpazila: "Select Upazila/Area",
        labelSelectDistrictForm: "District *",
        labelSelectUpazilaForm: "Upazila/Area *",
        districtPlaceholder: "Select District",
        upazilaPlaceholder: "Select Upazila",
        locationAlert: "Selecting District and Upazila is mandatory!",
        
        // Location & Anonymous selectors
        labelGpsBtn: "Get GPS Location",
        labelAnonymous: "Post Anonymously"
    }
};

// Seed Local Events Data with District and Upazila
const DEFAULT_POSTS = [
    {
        id: "post-1",
        title: "হ্রদ পরিষ্কার অভিযান (Dhanmondi Lake Clean-up)",
        venueName: "ধানমন্ডি লেক, রবীন্দ্র সরোবরের পাশে",
        category: "community",
        district: "Dhaka",
        upazila: "Dhanmondi",
        distributionTime: "আগামীকাল সকাল ৭টা থেকে ৯টা (Tomorrow 7:00 AM)",
        details: "আসুন আমরা সবাই মিলে আমাদের প্রিয় ধানমন্ডি লেক পরিষ্কার করি। আমাদের সাথে যুক্ত হতে পারেন, গ্লাভস এবং ব্যাগ আমাদের পক্ষ থেকে দেওয়া হবে।",
        lat: 23.7505,
        lng: 90.3765,
        upvotes: 28,
        flags: 0,
        status: "upcoming",
        reporterName: "সাজিদুর রহমান (Sajid)",
        date: new Date(Date.now() - 1 * 3600000).toISOString(),
        comments: [
            { author: "রাফি", text: "আমি অবশ্যই থাকব!", timestamp: new Date(Date.now() - 0.5 * 3600000).toISOString() }
        ]
    },
    {
        id: "post-2",
        title: "জুম্মা মোবারক উপলক্ষে জিলাপি বিতরণ (Jilapi Distribution)",
        venueName: "বায়তুল মোকাররম জাতীয় মসজিদ (Baitul Mukarram)",
        category: "food",
        district: "Dhaka",
        upazila: "Motijheel",
        distributionTime: "আজ আছর নামাজের পর (After Asr Today)",
        details: "মসজিদের উত্তর গেটের পাশে জিলাপি বিতরণ করা হবে। প্রতি শুক্রবারে এটি নিয়মিত হয়ে থাকে।",
        lat: 23.7289,
        lng: 90.4126,
        upvotes: 35,
        flags: 1,
        status: "today",
        reporterName: "রাহাত চৌধুরী (Rahat)",
        date: new Date(Date.now() - 3 * 3600000).toISOString(),
        comments: []
    },
    {
        id: "post-3",
        title: "পাড়ার ছেলেদের ফ্রেন্ডলি ক্রিকেট ম্যাচ (Friendly Cricket Match)",
        venueName: "সোবহানবাগ জামে মসজিদ সংলগ্ন মাঠ (Sobhanbagh Ground)",
        category: "sports",
        district: "Dhaka",
        upazila: "Dhanmondi",
        distributionTime: "আজ বিকেল ৪:০০ টা (Today at 4:00 PM)",
        details: "ধানমন্ডি ১১ নং বনাম সোবহানবাগ ক্লাবের মধ্যে একটি জাঁকজমকপূর্ণ ফ্রেন্ডলি ক্রিকেট ম্যাচ অনুষ্ঠিত হবে। সবাই আমন্ত্রিত।",
        lat: 23.7528,
        lng: 90.3774,
        upvotes: 19,
        flags: 0,
        status: "today",
        reporterName: "নিলয় হাসান (Niloy)",
        date: new Date(Date.now() - 5 * 3600000).toISOString(),
        comments: []
    },
    {
        id: "post-4",
        title: "বর্ষবরণ বৈশাখী মেলা (Boishakhi Mela)",
        venueName: "গুলশান ইয়ুথ ক্লাব খেলার মাঠ (Gulshan Youth Club Field)",
        category: "culture",
        district: "Dhaka",
        upazila: "Gulshan",
        distributionTime: "চলতি সপ্তাহ জুড়ে প্রতিদিন সকাল ১০টা থেকে রাত ৮টা",
        details: "হস্তশিল্প, পিঠা পুলি এবং মাটির খেলনাসহ ঐতিহ্যবাহী মেলার সব স্টল থাকছে। শিশুদের জন্য নাগরদোলারও ব্যবস্থা রয়েছে।",
        lat: 23.7913,
        lng: 90.4168,
        upvotes: 42,
        flags: 0,
        status: "today",
        reporterName: "আরিফ শেখ (Arif)",
        date: new Date(Date.now() - 24 * 3600000).toISOString(),
        comments: [
            { author: "মাশরাফি", text: "কালকে গিয়েছিলাম, খুব সুন্দর সাজিয়েছে!", timestamp: new Date(Date.now() - 10 * 3600000).toISOString() }
        ]
    },
    {
        id: "post-5",
        title: "জরুরী গ্যাস সংযোগ মেরামতের ঘোষণা (Gas Pipeline Repair Alert)",
        venueName: "তারা মসজিদ সংলগ্ন এলাকা, পুরান ঢাকা",
        category: "announcement",
        district: "Dhaka",
        upazila: "Sutrapur",
        distributionTime: "আজ দুপুর ২টা থেকে রাত ৮টা পর্যন্ত",
        details: "এলাকায় গ্যাস সংযোগ মেরামতের কাজ চলায় গ্যাস সরবরাহ সাময়িক বন্ধ থাকবে। দয়া করে লাইনের চাবি বন্ধ রাখুন।",
        lat: 23.7157,
        lng: 90.4018,
        upvotes: 61,
        flags: 2,
        status: "today",
        reporterName: "তন্ময় ঘোষ (Tonmoy)",
        date: new Date(Date.now() - 4 * 3600000).toISOString(),
        comments: [
            { author: "ইমতিয়াজ", text: "ধন্যবাদ ভাই জানানোর জন্য। রান্নার বিকল্প ব্যবস্থা করতে হবে।", timestamp: new Date(Date.now() - 3 * 3600000).toISOString() }
        ]
    }
];

const DEFAULT_CONTRIBUTORS = [
    { name: "তন্ময় ঘোষ (Tonmoy)", points: 310, verifications: 61 },
    { name: "সাজিদুর রহমান (Sajid)", points: 280, verifications: 48 },
    { name: "রাহাত চৌধুরী (Rahat)", points: 195, verifications: 35 },
    { name: "নিলয় হাসান (Niloy)", points: 120, verifications: 20 },
    { name: "আরিফ শেখ (Arif)", points: 95, verifications: 15 }
];



class StorageManager {
    static getPosts() {
        const posts = localStorage.getItem("localvibe_posts");
        if (!posts) {
            localStorage.setItem("localvibe_posts", JSON.stringify(DEFAULT_POSTS));
            return DEFAULT_POSTS;
        }
        return JSON.parse(posts);
    }

    static savePosts(posts) {
        localStorage.setItem("localvibe_posts", JSON.stringify(posts));
    }

    static addPost(post) {
        const posts = this.getPosts();
        posts.unshift(post);
        this.savePosts(posts);
        this.addPointsToUser(post.reporterName, 20);
        return posts;
    }

    static upvotePost(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        
        let votedPosts = JSON.parse(localStorage.getItem("localvibe_voted") || "[]");
        const alreadyVotedIndex = votedPosts.indexOf(postId);
        
        let state = '';
        if (post) {
            if (alreadyVotedIndex > -1) {
                votedPosts.splice(alreadyVotedIndex, 1);
                post.upvotes = Math.max(0, (post.upvotes || 0) - 1);
                this.addPointsToUser(post.reporterName, -5);
                state = 'removed';
            } else {
                votedPosts.push(postId);
                post.upvotes = (post.upvotes || 0) + 1;
                this.addPointsToUser(post.reporterName, 5);
                state = 'added';
            }
            this.savePosts(posts);
            localStorage.setItem("localvibe_voted", JSON.stringify(votedPosts));
        }
        return { posts, state };
    }

    static hasVoted(postId) {
        const votedPosts = JSON.parse(localStorage.getItem("localvibe_voted") || "[]");
        return votedPosts.includes(postId);
    }

    static toggleLocalVote(postId, state, reporterName) {
        let votedPosts = JSON.parse(localStorage.getItem("localvibe_voted") || "[]");
        const index = votedPosts.indexOf(postId);
        if (state === 'added') {
            if (index === -1) {
                votedPosts.push(postId);
                this.addPointsToUser(reporterName, 5);
            }
        } else if (state === 'removed') {
            if (index > -1) {
                votedPosts.splice(index, 1);
                this.addPointsToUser(reporterName, -5);
            }
        }
        localStorage.setItem("localvibe_voted", JSON.stringify(votedPosts));
    }

    static flagPost(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.flags = (post.flags || 0) + 1;
            if (post.flags >= 5) {
                this.addPointsToUser(post.reporterName, -25);
            }
            this.savePosts(posts);
        }
        return posts;
    }

    static addComment(postId, comment) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push(comment);
            this.savePosts(posts);
        }
        return posts;
    }

    static getContributors() {
        const contributors = localStorage.getItem("localvibe_contributors");
        if (!contributors) {
            localStorage.setItem("localvibe_contributors", JSON.stringify(DEFAULT_CONTRIBUTORS));
            return DEFAULT_CONTRIBUTORS;
        }
        return JSON.parse(contributors);
    }

    static addPointsToUser(userName, points) {
        const contributors = this.getContributors();
        const user = contributors.find(c => c.name === userName);
        if (user) {
            user.points += points;
            if (points > 0 && points !== 20) {
                user.verifications += 1;
            } else if (points < 0 && points !== -25) {
                user.verifications = Math.max(0, user.verifications - 1);
            }
        } else {
            contributors.push({
                name: userName,
                points: Math.max(0, points),
                verifications: points > 0 && points !== 20 ? 1 : 0
            });
        }
        contributors.sort((a, b) => b.points - a.points);
        localStorage.setItem("localvibe_contributors", JSON.stringify(contributors));

        // Sync to Firebase
        if (window.firebaseDb) {
            const db = window.firebaseDb;
            const { doc, setDoc, increment } = window.firestoreLib;
            const isVerification = points > 0 && points !== 20;
            const isUnverification = points < 0 && points !== -25;
            const verifInc = isVerification ? 1 : (isUnverification ? -1 : 0);

            const contribRef = doc(db, "contributors", userName);
            setDoc(contribRef, {
                name: userName,
                points: increment(points),
                verifications: increment(verifInc)
            }, { merge: true }).catch(err => console.error("Leaderboard Firebase sync failed:", err));
        }
    }
}
