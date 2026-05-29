// games.js
// Handles game card clicks and the Deductive Challenge fullscreen modal.

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card');

    const genericModal = document.getElementById('gameModal');
    const genericTitle = document.getElementById('modalTitle');
    const genericDesc = document.getElementById('modalDesc');
    const genericRules = document.getElementById('modalRules');
    const genericPlay = document.getElementById('modalPlay');
    const genericCancel = document.getElementById('modalCancel');

    const deductiveModal = document.getElementById('deductiveModal');
    const deductiveStart = document.getElementById('deductiveStartGame');
    const deductiveBack = document.getElementById('deductiveBack');
    const inductiveModal = document.getElementById('inductiveModal');
    const inductiveStart = document.getElementById('inductiveStart');
    const inductiveBack = document.getElementById('inductiveBack');
    const switchModal = document.getElementById('switchModal');
    const switchStart = document.getElementById('switchStartGame');
    const switchBack = document.getElementById('switchBack');
    const gridModal = document.getElementById('gridModal');
    const gridStart = document.getElementById('gridStart');
    const gridBack = document.getElementById('gridBack');
    const motionModal = document.getElementById('motionModal');
    const motionStart = document.getElementById('motionStart');
    const motionBack = document.getElementById('motionBack');

    if (!genericModal || !deductiveModal) return;

    let deductiveCloseTimer = null;

    function openGenericModal(title, rulesArray, description) {
        genericTitle.textContent = title;
        genericRules.innerHTML = '';
        if (genericDesc) {
            genericDesc.textContent = description || '';
            genericDesc.style.display = description ? 'block' : 'none';
        }

        rulesArray.forEach((rule) => {
            const li = document.createElement('li');
            li.textContent = rule;
            genericRules.appendChild(li);
        });

        genericModal.removeAttribute('hidden');
        genericModal.classList.add('open');
        // mark body as modal-open so UI (like navbar) can hide during the modal
        document.body.classList.add('modal-open');

        genericPlay.onclick = () => {
            alert('Starting "' + title + '" — placeholder action');
            closeGenericModal();
        };

        genericCancel.onclick = closeGenericModal;
    }

    function closeGenericModal() {
        genericModal.setAttribute('hidden', '');
        genericModal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    function openDeductiveModal() {
        window.clearTimeout(deductiveCloseTimer);
        deductiveModal.removeAttribute('hidden');
        deductiveModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            deductiveModal.classList.add('is-open');
        });
    }

    let inductiveCloseTimer = null;
    function openInductiveModal() {
        window.clearTimeout(inductiveCloseTimer);
        if (!inductiveModal) return;
        inductiveModal.removeAttribute('hidden');
        inductiveModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            inductiveModal.classList.add('is-open');
        });
    }

    let switchCloseTimer = null;
    function openSwitchModal() {
        window.clearTimeout(switchCloseTimer);
        if (!switchModal) return;
        switchModal.removeAttribute('hidden');
        switchModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            switchModal.classList.add('is-open');
        });
    }

    let gridCloseTimer = null;

    function renderGridSequence() {
        if (!gridModal) return;

        const playground = gridModal.querySelector('.memory-playground');
        if (!playground) return;

        const totalDots = Number(playground.dataset.sequence || 5);
        playground.innerHTML = '';

        const rect = playground.getBoundingClientRect();
        const width = Math.max(rect.width, 220);
        const height = Math.max(rect.height, 180);
        const padding = 20;
        const placed = [];

        function farEnough(left, top) {
            return placed.every((point) => Math.hypot(point.left - left, point.top - top) > 30);
        }

        for (let index = 0; index < totalDots; index++) {
            let left = padding;
            let top = padding;
            let guard = 0;

            do {
                left = Math.round(padding + Math.random() * (width - padding * 2));
                top = Math.round(padding + Math.random() * (height - padding * 2));
                guard += 1;
            } while (!farEnough(left, top) && guard < 30);

            placed.push({ left, top });

            const dot = document.createElement('div');
            dot.className = 'memory-dot';
            dot.style.left = left + 'px';
            dot.style.top = top + 'px';

            const badge = document.createElement('span');
            badge.className = 'memory-dot-index';
            badge.textContent = String(index + 1);
            dot.appendChild(badge);

            playground.appendChild(dot);
        }

        const dots = playground.querySelectorAll('.memory-dot');
        if (!dots.length) return;

        const highlightIndex = Math.floor(Math.random() * dots.length);
        dots.forEach((dot, index) => {
            if (index !== highlightIndex) {
                dot.classList.add('hidden-sequence');
            } else {
                dot.classList.add('highlighted', 'blinking');
            }
        });

        window.setTimeout(() => {
            const highlighted = dots[highlightIndex];
            if (highlighted) highlighted.classList.remove('blinking');
        }, 1400);
    }

    function openGridModal() {
        window.clearTimeout(gridCloseTimer);
        if (!gridModal) return;
        gridModal.removeAttribute('hidden');
        gridModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            gridModal.classList.add('is-open');
            window.setTimeout(renderGridSequence, 40);
        });
    }

    let motionCloseTimer = null;
    function openMotionModal() {
        window.clearTimeout(motionCloseTimer);
        if (!motionModal) return;
        motionModal.removeAttribute('hidden');
        motionModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            motionModal.classList.add('is-open');
        });
    }

    function closeMotionModal() {
        if (!motionModal) return;
        motionModal.classList.remove('is-open');
        motionModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        window.clearTimeout(motionCloseTimer);
        motionCloseTimer = window.setTimeout(() => {
            if (!motionModal.classList.contains('is-open')) {
                motionModal.setAttribute('hidden', '');
            }
        }, 240);
    }

    function closeDeductiveModal() {
        deductiveModal.classList.remove('is-open');
        deductiveModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        window.clearTimeout(deductiveCloseTimer);
        deductiveCloseTimer = window.setTimeout(() => {
            if (!deductiveModal.classList.contains('is-open')) {
                deductiveModal.setAttribute('hidden', '');
            }
        }, 240);
    }

    function closeSwitchModal() {
        if (!switchModal) return;
        switchModal.classList.remove('is-open');
        switchModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        window.clearTimeout(switchCloseTimer);
        switchCloseTimer = window.setTimeout(() => {
            if (!switchModal.classList.contains('is-open')) {
                switchModal.setAttribute('hidden', '');
            }
        }, 240);
    }

    function closeInductiveModal() {
        if (!inductiveModal) return;
        inductiveModal.classList.remove('is-open');
        inductiveModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        window.clearTimeout(inductiveCloseTimer);
        inductiveCloseTimer = window.setTimeout(() => {
            if (!inductiveModal.classList.contains('is-open')) {
                inductiveModal.setAttribute('hidden', '');
            }
        }, 240);
    }

    function closeGridModal() {
        if (!gridModal) return;
        gridModal.classList.remove('is-open');
        gridModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        window.clearTimeout(gridCloseTimer);
        gridCloseTimer = window.setTimeout(() => {
            if (!gridModal.classList.contains('is-open')) {
                gridModal.setAttribute('hidden', '');
            }
        }, 240);
    }

    function launchDeductiveGame() {
        closeDeductiveModal();

        const externalLauncher = window.startDeductiveGame || window.launchDeductiveGame;
        if (typeof externalLauncher === 'function') {
            externalLauncher();
            // mark the page as game-active so navbar hides during gameplay
            document.body.classList.add('game-active');
            return;
        }

        window.dispatchEvent(
            new CustomEvent('deductive-challenge:start', {
                detail: {
                    title: 'Deductive Challenge',
                    category: 'Processing Speed'
                }
            })
        );

        // mark the page as game-active so navbar hides during gameplay
        document.body.classList.add('game-active');

        const anchor = document.querySelector('#games');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function launchSwitchGame() {
        closeSwitchModal();

        const externalLauncher = window.startSwitchGame || window.launchSwitchGame;
        if (typeof externalLauncher === 'function') {
            externalLauncher();
            document.body.classList.add('game-active');
            return;
        }

        window.dispatchEvent(
            new CustomEvent('switch-challenge:start', {
                detail: {
                    title: 'Switch Challenge',
                    category: 'Processing Speed'
                }
            })
        );

        document.body.classList.add('game-active');

        const anchor = document.querySelector('#games');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function launchGridGame() {
        closeGridModal();

        const externalLauncher = window.startGridGame || window.launchGridGame;
        if (typeof externalLauncher === 'function') {
            externalLauncher();
            document.body.classList.add('game-active');
            return;
        }

        window.dispatchEvent(
            new CustomEvent('grid-challenge:start', {
                detail: {
                    title: 'Grid Challenge',
                    category: 'Memory'
                }
            })
        );

        document.body.classList.add('game-active');

        const anchor = document.querySelector('#games');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function launchMotionGame() {
        closeMotionModal();

        const externalLauncher = window.startMotionGame || window.launchMotionGame;
        if (typeof externalLauncher === 'function') {
            externalLauncher();
            document.body.classList.add('game-active');
            return;
        }

        window.dispatchEvent(
            new CustomEvent('motion-challenge:start', {
                detail: {
                    title: 'Motion Challenge',
                    category: 'Imagination'
                }
            })
        );

        document.body.classList.add('game-active');

        const anchor = document.querySelector('#games');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function openGameCard(card) {
        const title = card.dataset.title || 'Game';
        const rules = (card.dataset.rules || '').split('|').filter(Boolean);
        const description = card.dataset.description || '';
        const gameType = card.dataset.game || '';

        if (gameType === 'deductive' || title === 'Deductive Challenge') {
            openDeductiveModal();
            return;
        }
        if (gameType === 'inductive' || title === 'Inductive Challenge') {
            openInductiveModal();
            return;
        }
        if (gameType === 'switch' || title === 'Switch Challenge') {
            openSwitchModal();
            return;
        }
        if (gameType === 'grid' || title === 'Grid Challenge') {
            openGridModal();
            return;
        }
        if (gameType === 'motion' || title === 'Motion Challenge') {
            openMotionModal();
            return;
        }

        openGenericModal(title, rules, description);
    }

    cards.forEach((card) => {
        card.addEventListener('click', () => openGameCard(card));

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGameCard(card);
            }
        });
    });

    deductiveStart.addEventListener('click', launchDeductiveGame);
    deductiveBack.addEventListener('click', closeDeductiveModal);
    if (inductiveStart) inductiveStart.addEventListener('click', () => {
        closeInductiveModal();

        const externalLauncher = window.startInductiveGame || window.launchInductiveGame;
        if (typeof externalLauncher === 'function') {
            externalLauncher();
            document.body.classList.add('game-active');
            return;
        }

        window.dispatchEvent(
            new CustomEvent('inductive-challenge:start', {
                detail: {
                    title: 'Inductive Challenge',
                    category: 'Recognition'
                }
            })
        );

        document.body.classList.add('game-active');

        const anchor = document.querySelector('#games');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    if (inductiveBack) inductiveBack.addEventListener('click', closeInductiveModal);
    if (inductiveModal) {
        const inductiveOptions = inductiveModal.querySelectorAll('.inductive-option-card');
        inductiveOptions.forEach((optionCard) => {
            optionCard.addEventListener('click', () => {
                inductiveOptions.forEach((card) => card.classList.remove('is-selected'));
                optionCard.classList.add('is-selected');
            });
        });
    }
    if (switchStart) switchStart.addEventListener('click', launchSwitchGame);
    if (switchBack) switchBack.addEventListener('click', closeSwitchModal);
    if (gridStart) gridStart.addEventListener('click', launchGridGame);
    if (gridBack) gridBack.addEventListener('click', closeGridModal);
    if (motionStart) motionStart.addEventListener('click', launchMotionGame);
    if (motionBack) motionBack.addEventListener('click', closeMotionModal);

    deductiveModal.addEventListener('click', (event) => {
        if (event.target.dataset.close === 'true' || event.target.classList.contains('deductive-modal__close')) {
            closeDeductiveModal();
        }
    });

    if (switchModal) {
        switchModal.addEventListener('click', (event) => {
            if (event.target.dataset.close === 'true' || event.target.classList.contains('deductive-modal__close')) {
                closeSwitchModal();
            }
        });
    }
    if (inductiveModal) {
        inductiveModal.addEventListener('click', (event) => {
            if (event.target.dataset.close === 'true' || event.target.classList.contains('deductive-modal__close')) {
                closeInductiveModal();
            }
        });
    }
    if (gridModal) {
        gridModal.addEventListener('click', (event) => {
            if (event.target.dataset.close === 'true' || event.target.classList.contains('deductive-modal__close')) {
                closeGridModal();
            }
        });
    }

    if (motionModal) {
        motionModal.addEventListener('click', (event) => {
            if (event.target.dataset.close === 'true' || event.target.classList.contains('deductive-modal__close')) {
                closeMotionModal();
            }
        });
    }

    genericModal.addEventListener('click', (event) => {
        if (event.target.dataset.close === 'true' || event.target.classList.contains('modal-close')) {
            closeGenericModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        const deductiveOpen = deductiveModal.classList.contains('is-open');
        const inductiveOpen = inductiveModal && inductiveModal.classList.contains('is-open');
        const genericOpen = genericModal.classList.contains('open');
        const switchOpen = switchModal && switchModal.classList.contains('is-open');
        const gridOpen = gridModal && gridModal.classList.contains('is-open');

        if (event.key === 'Escape') {
            if (deductiveOpen) {
                closeDeductiveModal();
            } else if (inductiveOpen) {
                closeInductiveModal();
            } else if (genericOpen) {
                closeGenericModal();
            } else if (switchOpen) {
                closeSwitchModal();
            } else if (gridOpen) {
                closeGridModal();
            }
        }
    });
});
