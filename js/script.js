let currentPlanPrice = 129.90;
let selectedPlanTitle = "Standard";

// Tab Switching Functionality
function switchTab(tabId) {
    const pages = document.querySelectorAll('.page-tab');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(`page-${tabId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update Navigation Active Line State
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('border-emeraldBrand-600', 'text-emeraldBrand-600');
        btn.classList.add('border-transparent', 'text-slate-600');
    });

    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.add('border-emeraldBrand-600', 'text-emeraldBrand-600');
        activeNav.classList.remove('border-transparent', 'text-slate-600');
    }

    // Mobile menu: highlight the current page and close the drawer
    document.querySelectorAll('.mobile-nav').forEach(b => {
        const on = b.dataset.tab === tabId;
        b.classList.toggle('text-emeraldBrand-700', on);
        b.classList.toggle('font-bold', on);
        if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    navBtns.forEach(b => b.removeAttribute('aria-current'));
    if (activeNav) activeNav.setAttribute('aria-current', 'page');
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setMenu(open) {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('menu-toggle');
    const icon = document.getElementById('menu-icon');
    menu.classList.toggle('hidden', !open);
    if (btn) { btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (icon) { icon.classList.toggle('fa-bars-staggered', !open); icon.classList.toggle('fa-xmark', open); }
}
function toggleMobileMenu() {
    setMenu(document.getElementById('mobile-menu').classList.contains('hidden'));
}

// Arrival date: only today or later can be chosen
document.addEventListener('DOMContentLoaded', function () {
    const d = document.getElementById('arrival-date');
    if (!d) return;
    const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    const today = t.toISOString().slice(0, 10);
    d.min = today;
    if (!d.value || d.value < today) d.value = today;
});

// Used by "Enquire" buttons, the details screen and the help box
function choosePackage(key) {
    if (key === 'custom') {
        switchTab('contact');
        const sel = document.getElementById('c-type');
        if (sel) sel.value = 'Custom package / accessibility needs';
        const msg = document.getElementById('c-msg');
        if (msg && !msg.value) msg.placeholder = 'Tell us about your group, dates or accessibility requirements';
        return;
    }
    const plans = { short: [89.00, 'Short-term'], standard: [129.90, 'Standard'], premium: [199.90, 'Premium'] };
    switchTab('checkout');
    selectPlan(key, plans[key][0], plans[key][1]);
}

// Accessible guest-count dropdown (1–4 guests)
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('guest-picker-toggle');
    const menu = document.getElementById('guest-picker-menu');
    const label = document.getElementById('guest-count-label');
    if (!toggle || !menu || !label) return;
    toggle.addEventListener('click', function (event) {
        event.stopPropagation();
        const opening = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        toggle.setAttribute('aria-expanded', String(opening));
    });
    menu.querySelectorAll('[data-guests]').forEach(function (option) {
        option.addEventListener('click', function () {
            const count = Number(option.dataset.guests);
            label.textContent = count + (count === 1 ? ' guest' : ' guests');
            menu.querySelectorAll('.guest-check').forEach(icon => icon.classList.add('hidden'));
            const check = option.querySelector('.guest-check');
            if (check) check.classList.remove('hidden');
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', function (event) {
        if (!document.getElementById('guest-picker-wrap').contains(event.target)) {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Plan Selection Logic for Checkout Page
function selectPlan(planKey, price, title) {
    currentPlanPrice = price;
    selectedPlanTitle = title;

    const DARK = ['bg-slate-800/80', 'hover:bg-slate-800', 'border-slate-700'];
    const LIGHT = ['bg-white', 'text-slate-900', 'border-emeraldBrand-500', 'ring-4', 'ring-emeraldBrand-500/15', 'shadow-xl', 'shadow-emeraldBrand-900/20'];
    document.querySelectorAll('.plan-card').forEach(card => {
        const isActive = card.dataset.plan === planKey;
        const isCustom = card.dataset.plan === 'custom';
        card.classList.remove(...DARK, ...LIGHT);
        card.classList.add(...(isActive ? LIGHT : DARK));
        card.setAttribute('aria-pressed', String(isActive));
        const check = card.querySelector('.check-icon');
        if (check) check.classList.toggle('hidden', !isActive);
        const header = card.querySelector('div.text-center');
        if (header) {
            header.className = isActive
                ? 'bg-emerald-50 text-emerald-900 text-center py-2 px-3 rounded-xl font-bold text-xs mt-1 flex items-center justify-center gap-1.5 border border-emerald-100'
                : 'bg-slate-700/80 text-white text-center py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 group-hover:bg-emeraldBrand-700 transition';
        }
        card.querySelectorAll('.py-3 p').forEach((p, i) => {
            if (i === 0) p.className = 'font-bold text-xs uppercase tracking-wider ' + (isActive ? 'text-emeraldBrand-700' : 'text-emerald-300');
            if (i === 1) p.className = 'text-[13px] leading-snug mt-1 ' + (isActive ? 'text-slate-600' : 'text-slate-300');
            if (i === 2) p.className = 'text-base font-extrabold mt-3 ' + (isActive ? 'text-slate-950' : 'text-white');
        });
        const btn = card.querySelector('button');
        if (btn && !isCustom) {
            btn.textContent = isActive ? 'Selected' : 'Select';
            btn.className = isActive
                ? 'w-full bg-emeraldBrand-700 hover:bg-emeraldBrand-800 text-white text-xs py-2.5 rounded-xl font-bold shadow-md'
                : 'w-full bg-slate-700 text-slate-200 text-xs py-2 rounded-xl group-hover:bg-emeraldBrand-600 group-hover:text-white transition font-semibold';
            btn.setAttribute('aria-label', (isActive ? 'Selected: ' : 'Select ') + title + ' package');
        }
    });

    // Update Breakdown Details in Sidebar
    document.getElementById('summary-plan-name').textContent = title;
    document.getElementById('summary-subtotal').textContent = `S$${price.toFixed(2)}`;
    const total = price + 29.00;
    document.getElementById('summary-total').textContent = `S$${total.toFixed(2)}`;
}

// ==========================================
// ADD-ON: Professional room detail experience
// Adds a details button and a full-page-style details view without
// changing the original page structure or existing room cards.
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const roomDetails = [
        {
            title: 'Premium Studio Apartment', plan: 'premium',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
            gallery: [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85'
            ],
            price: 'S$199.90', period: 'night', rating: '4.9', reviews: 'Sample rating', guests: '1–2 guests', beds: '1 double bed', size: 'Private studio', bedrooms: 'Studio', bathrooms: 'Private bathroom',
            location: 'Sky-nest, Singapore',
            description: 'A private studio apartment for residents who want their own space. Weekly cleaning, utilities and high-speed internet are included, with access to every Sky-nest facility and a monthly community events pass.',
            highlights: ['Private studio apartment', 'Weekly cleaning service', 'Utilities and internet included', 'Monthly community events pass'],
            amenities: [['fa-wifi','High-speed Wi-Fi'],['fa-snowflake','Air conditioning'],['fa-tv','Smart TV'],['fa-mug-hot','Coffee & tea'],['fa-elevator','Elevator access'],['fa-shield-halved','Secure building'],['fa-briefcase','Workspace'],['fa-bath','Private bathroom']],
            note: 'Prices and photos are examples to be confirmed by Sky-nest before publishing.'
        },
        {
            title: 'Standard Private Bedroom', plan: 'standard',
            image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
            gallery: [
                'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85'
            ],
            price: 'S$129.90', period: 'night', rating: '3.8', reviews: 'Sample rating', guests: '1 guest', beds: '1 double bed', size: 'Private bedroom', bedrooms: 'Shared apartment', bathrooms: 'Shared bathroom',
            location: 'Sky-nest, Singapore',
            description: 'A private bedroom in a shared apartment, ideal for students and young professionals. Fortnightly cleaning and utilities are included, with access to the co-working space, shared kitchen and lounge.',
            highlights: ['Private lockable bedroom', 'Fortnightly cleaning', 'Co-working space access', 'Shared kitchen and lounge'],
            amenities: [['fa-wifi','High-speed Wi-Fi'],['fa-snowflake','Air conditioning'],['fa-tv','Smart TV'],['fa-utensils','Kitchen / dining area'],['fa-elevator','Elevator access'],['fa-shield-halved','Secure building'],['fa-briefcase','Workspace'],['fa-shirt','Laundry facilities']],
            note: 'Prices and photos are examples to be confirmed by Sky-nest before publishing.'
        },
        {
            title: 'Short-Term Furnished Room', plan: 'short',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
            gallery: [
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85'
            ],
            price: 'S$89.00', period: 'night', rating: '4.95', reviews: 'Sample rating', guests: '1 guest', beds: '1 bed', size: '1–4 weeks', bedrooms: 'Furnished room', bathrooms: 'Shared bathroom',
            location: 'Sky-nest, Singapore',
            description: 'A furnished room with flexible booking from one to four weeks — useful when you have just arrived in Singapore. Utilities are included, with limited access to the shared facilities.',
            highlights: ['Flexible 1–4 week booking', 'Fully furnished room', 'Utilities included', 'Limited shared-facility access'],
            amenities: [['fa-wifi','High-speed Wi-Fi'],['fa-snowflake','Air conditioning'],['fa-tv','Smart TV'],['fa-utensils','Kitchen / dining area'],['fa-shirt','Laundry rooms'],['fa-shield-halved','Secure accommodation'],['fa-key','Key-card access'],['fa-bath','Private bathrooms']],
            note: 'Prices and photos are examples to be confirmed by Sky-nest before publishing.'
        }
    ];

    // Build a hotel-style details screen as an add-on. The original site sections remain untouched.
    const detailScreen = document.createElement('section');
    detailScreen.id = 'room-details-screen';
    detailScreen.className = 'fixed inset-0 z-[100] hidden overflow-y-auto bg-[#f8f9f7] text-slate-800';
    detailScreen.innerHTML = `
        <div class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
            <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <button id="room-details-back" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emeraldBrand-700"><i class="fa-solid fa-arrow-left"></i><span>Back to stay options</span></button>
                <div class="hidden items-center gap-2 sm:flex"><span class="font-extrabold tracking-tight text-slate-900">Sky<span class="text-emeraldBrand-600">-nest</span></span><span class="text-xs uppercase tracking-[.2em] text-slate-400">Singapore stays</span></div>
                <button id="room-details-share" class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"><i class="fa-solid fa-share-nodes"></i><span class="hidden sm:inline">Share</span></button>
            </div>
        </div>
        <main class="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
            <div class="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500"><span>Singapore</span><i class="fa-solid fa-chevron-right text-[9px]"></i><span>Residences</span><i class="fa-solid fa-chevron-right text-[9px]"></i><span id="rd-breadcrumb" class="text-emeraldBrand-700"></span></div>
            <div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div><div class="mb-3 flex flex-wrap items-center gap-2"><span class="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Premium residence</span><span class="inline-flex items-center gap-1 text-sm font-bold text-slate-700"><i class="fa-solid fa-star text-amber-400"></i><span id="rd-rating"></span></span><span id="rd-review-label" class="text-sm text-slate-500"></span></div><h1 id="rd-title" class="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px]"></h1><p id="rd-location" class="mt-3 flex items-center gap-2 text-sm text-slate-500"><i class="fa-solid fa-location-dot text-emeraldBrand-600"></i></p></div>
                <div class="flex items-center gap-3"><button id="rd-save" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:border-rose-200 hover:text-rose-600"><i class="fa-regular fa-heart"></i><span>Save</span></button><span class="hidden text-xs text-slate-400 sm:inline">Photos for illustration</span></div>
            </div>
            <div id="rd-gallery" class="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:grid-cols-4 sm:grid-rows-2" style="min-height:280px"></div>
            <div class="mt-8 grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-12">
                <div class="min-w-0">
                    <section class="border-b border-slate-200 pb-7"><h2 class="text-xl font-extrabold text-slate-900">A closer look at your stay</h2><p id="rd-description" class="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600"></p><div id="rd-stats" class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"></div></section>
                    <section class="border-b border-slate-200 py-7"><h2 class="text-xl font-extrabold text-slate-900">What makes this residence special</h2><div id="rd-highlights" class="mt-4 grid gap-3 sm:grid-cols-2"></div></section>
                    <section class="border-b border-slate-200 py-7"><h2 class="text-xl font-extrabold text-slate-900">Amenities</h2><p class="mt-1 text-sm text-slate-500">Comforts and features to help you settle in.</p><div id="rd-amenities" class="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2"></div></section>
                    <section class="border-b border-slate-200 py-7"><h2 class="text-xl font-extrabold text-slate-900">Location</h2><p id="rd-location-description" class="mt-3 leading-7 text-slate-600"></p><div class="mt-4 flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"><i class="fa-solid fa-location-dot mt-1 text-emeraldBrand-700"></i><div><p id="rd-location-card" class="font-bold text-slate-800"></p><p class="mt-1 text-sm text-slate-500">Exact address and directions can be confirmed before booking.</p></div></div></section>
                    <section class="py-7"><h2 class="text-xl font-extrabold text-slate-900">Good to know</h2><div class="mt-4 grid gap-4 sm:grid-cols-2"><div class="rounded-xl border border-slate-200 bg-white p-4"><p class="font-bold"><i class="fa-regular fa-clock mr-2 text-emeraldBrand-700"></i>Check-in & check-out</p><p class="mt-2 text-sm leading-6 text-slate-500">Times and arrival instructions are confirmed with the host before your stay.</p></div><div class="rounded-xl border border-slate-200 bg-white p-4"><p class="font-bold"><i class="fa-solid fa-file-shield mr-2 text-emeraldBrand-700"></i>House rules</p><p class="mt-2 text-sm leading-6 text-slate-500">Please confirm guest policies, cancellation terms and any deposit before payment.</p></div></div><p id="rd-demo-note" class="mt-4 text-xs leading-5 text-slate-400"></p></section>
                </div>
                <aside class="h-fit lg:sticky lg:top-24"><div class="rounded-2xl border-2 border-emerald-100 bg-white p-5 text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,.12)] sm:p-6"><div class="flex items-start justify-between gap-3"><div><span id="rd-price" class="inline-block rounded-lg bg-emerald-50 px-2 py-1 text-2xl font-extrabold tracking-tight text-emerald-950"></span><span id="rd-period" class="ml-1 text-sm text-slate-500"></span><p class="mt-1 text-xs text-slate-500">Listed starting price</p></div><div class="rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-bold text-slate-700"><i class="fa-solid fa-star mr-1 text-amber-400"></i><span id="rd-rating-side"></span></div></div><div class="mt-5 rounded-xl border border-slate-200"><div class="grid grid-cols-2 divide-x divide-slate-200"><div class="p-3"><p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Check-in</p><p class="mt-1 text-sm font-semibold">Add dates</p></div><div class="p-3"><p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Check-out</p><p class="mt-1 text-sm font-semibold">Add dates</p></div></div><div class="border-t border-slate-200 p-3"><p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Guests</p><p id="rd-guests-select" class="mt-1 text-sm font-semibold"></p></div></div><button id="rd-book" class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emeraldBrand-700 px-5 py-3.5 font-bold text-white shadow-lg shadow-emeraldBrand-700/20 transition hover:bg-emeraldBrand-800">Enquire about this stay <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true"></i></button><p class="mt-3 text-center text-xs text-slate-500">An enquiry does not confirm a booking or payment.</p><div class="my-5 border-t border-slate-100"></div><div class="space-y-3 text-sm text-slate-600"><p class="flex items-start gap-3"><i class="fa-solid fa-check mt-1 text-emeraldBrand-600"></i><span>Residence details shown before booking</span></p><p class="flex items-start gap-3"><i class="fa-solid fa-headset mt-1 text-emeraldBrand-600"></i><span>Contact the host to confirm special requests</span></p><p class="flex items-start gap-3"><i class="fa-solid fa-shield-halved mt-1 text-emeraldBrand-600"></i><span>Review cancellation and payment terms first</span></p></div></div><div class="mt-4 rounded-xl bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-950"><i class="fa-solid fa-circle-info mr-2"></i>Need help choosing? Contact our team before making a reservation.</div></aside>
            </div>
        </main>
        <div id="rd-lightbox" class="fixed inset-0 z-[120] hidden items-center justify-center bg-black/95 p-4"><button id="rd-lightbox-close" class="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-2xl text-white hover:bg-white/20" aria-label="Close photo viewer">&times;</button><button id="rd-prev" class="absolute left-3 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20 sm:left-8" aria-label="Previous photo"><i class="fa-solid fa-chevron-left"></i></button><img id="rd-lightbox-image" src="" alt="Residence photo" class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"><button id="rd-next" class="absolute right-3 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20 sm:right-8" aria-label="Next photo"><i class="fa-solid fa-chevron-right"></i></button></div>
    `;



    document.body.appendChild(detailScreen);

    let activeRoom = null;
    let activeGalleryIndex = 0;
    const roomCards = document.querySelectorAll('#page-home .grid.grid-cols-1[class~="md:grid-cols-3"] > div');

    function openRoomDetails(index) {
        const room = roomDetails[index];
        if (!room) return;
        activeRoom = room;
        activeGalleryIndex = 0;
        document.getElementById('rd-breadcrumb').textContent = room.title;
        document.getElementById('rd-title').textContent = room.title;
        document.getElementById('rd-location').innerHTML = '<i class="fa-solid fa-location-dot text-emeraldBrand-600"></i> ' + room.location;
        document.getElementById('rd-rating').textContent = room.rating;
        document.getElementById('rd-rating-side').textContent = room.rating;
        document.getElementById('rd-review-label').textContent = '· ' + room.reviews;
        document.getElementById('rd-description').textContent = room.description;
        document.getElementById('rd-location-description').textContent = 'This room is part of the Sky-nest co-living building in Singapore. The exact address and nearby transport options are confirmed by our team when you enquire.';
        document.getElementById('rd-location-card').textContent = room.location;
        document.getElementById('rd-price').textContent = room.price;
        document.getElementById('rd-period').textContent = '/ ' + room.period;
        document.getElementById('rd-guests-select').textContent = room.guests;
        document.getElementById('rd-demo-note').textContent = room.note;

        const gallery = document.getElementById('rd-gallery');
        const knownPhotos = { '1582719478250': 'Room', '1618773928121': 'Room', '1590490360182': 'Room', '1600607687939': 'Living area' };
        const photoLabels = room.gallery.map(src => knownPhotos[(src.match(/photo-(\d+)/) || [])[1]] || 'Interior');
        gallery.innerHTML = room.gallery.map((src, i) => `
            <button type="button" class="rd-gallery-item group relative overflow-hidden bg-slate-200 ${i === 0 ? 'col-span-1 sm:col-span-2 sm:row-span-2 min-h-[280px] sm:min-h-[420px]' : 'min-h-[140px]'}" data-photo-index="${i}" aria-label="View ${photoLabels[i]} photo">
                <img src="${src}" alt="${room.title} — ${photoLabels[i]}" class="h-full min-h-[inherit] w-full object-cover transition duration-500 group-hover:scale-105" loading="${i === 0 ? 'eager' : 'lazy'}" style="display:block;min-height:140px;background:#e2e8f0" onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src=activeRoom.galleryFallback?.[${i}] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80';}else{this.style.opacity='.15';this.parentElement.style.background='#e2e8f0';}">
                <span class="absolute bottom-3 left-3 rounded-lg bg-slate-900/90 px-3 py-2 text-xs font-extrabold text-white shadow-lg ring-1 ring-white/30 backdrop-blur-sm">${photoLabels[i]}</span>
                ${i === 4 ? '<span class="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow"><i class="fa-solid fa-images mr-2"></i>View all photos</span>' : ''}
            </button>`).join('');
        gallery.querySelectorAll('[data-photo-index]').forEach(btn => btn.addEventListener('click', () => showLightbox(Number(btn.dataset.photoIndex))));

        document.getElementById('rd-stats').innerHTML = [
            ['fa-ruler-combined', room.size], ['fa-user-group', room.guests], ['fa-bed', room.beds], ['fa-bath', room.bathrooms]
        ].map(([icon, value]) => `<div class="rounded-xl bg-white p-4 ring-1 ring-slate-200"><i class="fa-solid ${icon} text-lg text-emeraldBrand-700"></i><p class="mt-3 text-sm font-bold text-slate-900">${value}</p></div>`).join('');
        document.getElementById('rd-highlights').innerHTML = room.highlights.map(item => `<div class="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"><i class="fa-solid fa-check mt-1 text-emeraldBrand-700"></i><span class="text-sm font-medium leading-6 text-slate-700">${item}</span></div>`).join('');
        document.getElementById('rd-amenities').innerHTML = room.amenities.map(([icon, label]) => `<div class="flex items-center gap-3 text-sm text-slate-700"><i class="fa-solid ${icon} w-5 text-center text-lg text-emeraldBrand-700"></i><span>${label}</span></div>`).join('');
        detailScreen.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        detailScreen.scrollTop = 0;
        history.pushState({ roomDetails: true }, '', '#residence-' + index);
    }

    function closeRoomDetails() {
        detailScreen.classList.add('hidden');
        document.body.style.overflow = '';
        if (location.hash.startsWith('#residence-')) history.replaceState(null, '', location.pathname + location.search);
    }

    function showLightbox(index) {
        if (!activeRoom) return;
        activeGalleryIndex = (index + activeRoom.gallery.length) % activeRoom.gallery.length;
        document.getElementById('rd-lightbox-image').src = activeRoom.gallery[activeGalleryIndex];
        const lightbox = document.getElementById('rd-lightbox');
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    }
    function moveLightbox(step) { if (activeRoom) showLightbox(activeGalleryIndex + step); }
    function closeLightbox() {
        const lightbox = document.getElementById('rd-lightbox');
        lightbox.classList.add('hidden'); lightbox.classList.remove('flex');
    }

    roomCards.forEach(function (card, index) {
        const room = roomDetails[index];
        if (!room) return;
        // Add an explicit professional-style button without replacing any existing card content.
        const actions = card.querySelector('.flex.items-center.justify-between');
        if (actions && !actions.querySelector('.room-details-trigger')) {
            const detailsButton = document.createElement('button');
            detailsButton.type = 'button';
            detailsButton.className = 'room-details-trigger mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emeraldBrand-700 bg-white px-3.5 py-2.5 text-xs font-bold text-emeraldBrand-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500';
            detailsButton.innerHTML = 'View residence details <i class="fa-solid fa-arrow-right"></i>';
            detailsButton.addEventListener('click', () => openRoomDetails(index));
            // Place the new details button after the existing row, leaving Reserve untouched.
            actions.parentElement.appendChild(detailsButton);
        }
        // Cards are also clickable, but clicks on the existing Reserve button keep their original action.
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (event) {
            if (event.target.closest('button, a')) return;
            openRoomDetails(index);
        });
    });

    document.getElementById('room-details-back').addEventListener('click', closeRoomDetails);
    document.getElementById('rd-book').addEventListener('click', function () {
        closeRoomDetails();
        choosePackage(activeRoom ? activeRoom.plan : 'standard');
    });
    document.getElementById('room-details-share').addEventListener('click', async function () {
        const shareData = { title: activeRoom ? activeRoom.title : 'Sky-nest Singapore', text: activeRoom ? activeRoom.description : 'Explore Sky-nest Singapore residences', url: location.href };
        try { if (navigator.share) await navigator.share(shareData); else if (navigator.clipboard) { await navigator.clipboard.writeText(location.href); this.innerHTML = '<i class="fa-solid fa-check"></i><span class="hidden sm:inline">Link copied</span>'; } }
        catch (error) { /* User cancelled share; no action needed. */ }
    });
    document.getElementById('rd-save').addEventListener('click', function () {
        const saved = this.classList.toggle('text-rose-600');
        this.innerHTML = saved ? '<i class="fa-solid fa-heart"></i><span>Saved</span>' : '<i class="fa-regular fa-heart"></i><span>Save</span>';
    });
    document.getElementById('rd-prev').addEventListener('click', () => moveLightbox(-1));
    document.getElementById('rd-next').addEventListener('click', () => moveLightbox(1));
    document.getElementById('rd-lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('rd-lightbox').addEventListener('click', event => { if (event.target.id === 'rd-lightbox') closeLightbox(); });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { closeLightbox(); if (!detailScreen.classList.contains('hidden')) closeRoomDetails(); }
        if (!document.getElementById('rd-lightbox').classList.contains('hidden')) {
            if (event.key === 'ArrowLeft') moveLightbox(-1);
            if (event.key === 'ArrowRight') moveLightbox(1);
        }
    });
});

// Custom Modal Function (accessible dialog: focus moves in, Escape closes, focus returns)
let lastFocus = null;
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !document.getElementById('custom-modal').classList.contains('hidden')) closeModal();
});
function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;

    const modal = document.getElementById('custom-modal');
    const box = document.getElementById('modal-box');

    lastFocus = document.activeElement;
    modal.classList.remove('hidden');
    setTimeout(() => { document.getElementById('modal-close').focus(); }, 30);
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    const box = document.getElementById('modal-box');

    box.classList.remove('scale-100');
    box.classList.add('scale-95');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
    }, 300);
}

// Handlers for form submissions
function handleCheckoutSubmit(e) {
    e.preventDefault();
    showModal('Enquiry Sent!', `Thank you! Your enquiry about the ${selectedPlanTitle} package has been recorded. This does not confirm a booking or payment. Our team will reply by email.`);
    e.target.reset();
}

function handleContactSubmit(e) {
    e.preventDefault();
    showModal('Message Received', 'Thank you for contacting Sky-nest. Your message has been sent and our team will reply to the email address you gave.');
    e.target.reset();
}

window.onload = function() {
    switchTab('home');
};
