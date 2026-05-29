// feedback.js
// Connects the feedback form to Google Sheets via Google Apps Script

// 1) Paste your deployed Apps Script Web App URL here.
// Example: https://script.google.com/macros/s/AKfycbx.../exec
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbykuifdKgEUAwX4HRqKXdbhH-KdhOMgIGuEYBWxi5LMnM8cAHSGiwincfhB4ahchJWC/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const status = document.getElementById('feedbackStatus');

    if (!form || !status) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const resetButton = form.querySelector('button[type="reset"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Send';

    const setStatus = (message, type) => {
        status.style.display = 'block';
        status.textContent = message;
        if (type === 'error') {
            status.style.color = '#b91c1c';
        } else if (type === 'success') {
            status.style.color = '#15803d';
        } else {
            status.style.color = '#1d4ed8';
        }
    };

    const setLoading = (isLoading) => {
        if (!submitButton) return;
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Sending...' : originalButtonText;
        submitButton.classList.toggle('is-loading', isLoading);
        if (resetButton) {
            resetButton.disabled = isLoading;
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (GOOGLE_SHEET_WEB_APP_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
            setStatus('Please paste your Google Apps Script Web App URL inside js/feedback.js first.', 'error');
            return;
        }

        const formData = new FormData(form);
        const payload = {
            name: (formData.get('name') || '').toString().trim(),
            email: (formData.get('email') || '').toString().trim(),
            message: (formData.get('message') || '').toString().trim(),
            timestamp: new Date().toISOString(),
        };

        if (!payload.name || !payload.email || !payload.message) {
            setStatus('Please fill all fields before sending.', 'error');
            return;
        }

        try {
            setLoading(true);
            setStatus('Sending your feedback...', 'success');

            const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload),
            });

            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch {
                result = { status: 'error', message: text || 'Unexpected response from server.' };
            }

            if (!response.ok || result.status !== 'success') {
                throw new Error(result.message || 'Failed to submit feedback.');
            }

            form.reset();
            setStatus('Thanks — your feedback was received successfully.', 'success');
        } catch (error) {
            setStatus(error.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    form.addEventListener('reset', () => {
        status.style.display = 'none';
        status.textContent = '';
    });
});
