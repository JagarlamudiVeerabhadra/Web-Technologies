class DynamicSurveyBuilder {
    constructor() {
        // Question structure with types and validation rules
        this.questions = [
            {
                id: 'q1',
                text: 'What is your primary occupation?',
                type: 'text',
                required: true,
                maxLength: 100,
                validation: {
                    minLength: 2,
                    pattern: /^[a-zA-Z\s]+$/
                }
            },
            {
                id: 'q2',
                text: 'How satisfied are you with our service?',
                type: 'radio',
                required: true,
                options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                validation: {
                    required: true
                }
            },
            {
                id: 'q3',
                text: 'Which features do you use most frequently? (Select up to 3)',
                type: 'checkbox',
                required: true,
                options: ['Search Functionality', 'User Profiles', 'Messaging', 'Analytics', 'Reports', 'Settings'],
                validation: {
                    minSelections: 1,
                    maxSelections: 3
                }
            },
            {
                id: 'q4',
                text: 'Any additional feedback? (Optional)',
                type: 'text',
                required: false,
                maxLength: 500,
                validation: {
                    maxLength: 500
                }
            },
            {
                id: 'q5',
                text: 'What is your age group?',
                type: 'radio',
                required: true,
                options: ['18-24', '25-34', '35-44', '45-54', '55+'],
                validation: {
                    required: true
                }
            }
        ];
        
        this.responses = {};
        this.init();
    }

    init() {
        this.generateSurvey();
        this.attachEventListeners();
    }

    generateSurvey() {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = this.questions.map(question => this.createQuestionHTML(question)).join('');
    }

    createQuestionHTML(question) {
        const requiredMark = question.required ? '<span class="required">*</span>' : '';
        const questionHeader = `<div class="question-header">
            ${question.text} ${requiredMark}
            <span class="question-type">${question.type.toUpperCase()}</span>
        </div>`;

        let fieldHTML = '';
        
        switch(question.type) {
            case 'text':
                fieldHTML = `<input type="text" class="text-input" id="${question.id}" 
                             name="${question.id}" maxlength="${question.maxLength || 1000}"
                             placeholder="Enter your response here..." />`;
                break;
                
            case 'radio':
                fieldHTML = `<div class="options-group">
                    ${question.options.map((option, index) => `
                        <label class="option-item">
                            <input type="radio" name="${question.id}" value="${option}" />
                            ${option}
                        </label>
                    `).join('')}
                </div>`;
                break;
                
            case 'checkbox':
                fieldHTML = `<div class="options-group">
                    ${question.options.map((option, index) => `
                        <label class="option-item">
                            <input type="checkbox" name="${question.id}" value="${option}" />
                            ${option}
                        </label>
                    `).join('')}
                </div>`;
                break;
        }

        return `
            <div class="question-group" data-question="${question.id}">
                ${questionHeader}
                ${fieldHTML}
                <div class="validation-message error" id="${question.id}-error"></div>
                <div class="validation-message success" id="${question.id}-success"></div>
            </div>
        `;
    }

    attachEventListeners() {
        // Input events for text fields
        document.querySelectorAll('.text-input').forEach(input => {
            input.addEventListener('input', (e) => this.validateField(e.target.closest('.question-group').dataset.question));
            input.addEventListener('blur', (e) => this.validateField(e.target.closest('.question-group').dataset.question));
        });

        // Radio and checkbox events
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.validateField(e.target.closest('.question-group').dataset.question);
            });
        });

        // Form submission
        document.getElementById('surveyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.isFormValid()) {
                this.submitSurvey();
            }
        });
    }

    validateField(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        const questionGroup = document.querySelector(`[data-question="${questionId}"]`);
        const inputs = document.querySelectorAll(`[name="${questionId}"]`);
        let isValid = true;
        let errorMsg = '';

        switch(question.type) {
            case 'text':
                const textInput = inputs[0];
                const value = textInput.value.trim();
                isValid = this.validateTextField(question, value);
                errorMsg = question.validation.errorMsg || 'Please provide a valid response';
                break;

            case 'radio':
                const selectedRadio = Array.from(inputs).find(radio => radio.checked);
                isValid = selectedRadio !== undefined;
                errorMsg = question.required ? 'Please select one option' : '';
                break;

            case 'checkbox':
                const checkedBoxes = Array.from(inputs).filter(cb => cb.checked);
                const min = question.validation.minSelections || 0;
                const max = question.validation.maxSelections || Infinity;
                isValid = checkedBoxes.length >= min && checkedBoxes.length <= max;
                errorMsg = checkedBoxes.length === 0 ? 'Please select at least one option' : 
                          checkedBoxes.length > max ? `Maximum ${max} selections allowed` : '';
                break;
        }

        this.showValidationFeedback(questionId, isValid, errorMsg);
        this.updateFormProgress();
        this.toggleSubmitButton();
        
        // Store response
        this.storeResponse(questionId, inputs);
    }

    validateTextField(question, value) {
        if (question.required && !value) return false;
        if (!question.required && !value) return true;
        
        const rules = question.validation;
        if (rules.minLength && value.length < rules.minLength) return false;
        if (rules.maxLength && value.length > rules.maxLength) return false;
        if (rules.pattern && !rules.pattern.test(value)) return false;
        
        return true;
    }

    storeResponse(questionId, inputs) {
        const question = this.questions.find(q => q.id === questionId);
        switch(question.type) {
            case 'text':
                this.responses[questionId] = inputs[0].value.trim();
                break;
            case 'radio':
                const selected = Array.from(inputs).find(r => r.checked);
                this.responses[questionId] = selected ? selected.value : null;
                break;
            case 'checkbox':
                const checked = Array.from(inputs).filter(cb => cb.checked).map(cb => cb.value);
                this.responses[questionId] = checked;
                break;
        }
    }

    showValidationFeedback(questionId, isValid, errorMsg) {
        const questionGroup = document.querySelector(`[data-question="${questionId}"]`);
        const errorEl = document.getElementById(`${questionId}-error`);
        const successEl = document.getElementById(`${questionId}-success`);

        questionGroup.classList.toggle('invalid', !isValid);
        questionGroup.classList.toggle('valid', isValid);

        errorEl.textContent = errorMsg;
        errorEl.classList.toggle('error', !isValid);
        
        successEl.style.display = isValid ? 'block' : 'none';
        errorEl.style.display = !isValid && errorMsg ? 'block' : 'none';
    }

    isFormValid() {
        return this.questions.every(question => {
            if (!question.required) return true;
            return this.responses[question.id] !== undefined && this.responses[question.id] !== '';
        });
    }

    updateFormProgress() {
        const validQuestions = this.questions.filter(q => {
            if (!q.required) return true;
            return this.responses[q.id] !== undefined && this.responses[q.id] !== '';
        }).length;
        
        const progress = (validQuestions / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    toggleSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = !this.isFormValid();
    }

    submitSurvey() {
        const results = {
            timestamp: new Date().toISOString(),
            responses: this.responses,
            totalQuestions: this.questions.length,
            completedAt: new Date().toLocaleString()
        };

        // Simulate API submission
        console.log('Survey Results:', results);
        
        alert(`✅ Survey submitted successfully!\n\nCompleted ${this.questions.length} questions.\n\nSee console for full results.`);
        
        // Reset form
        this.responses = {};
        document.getElementById('surveyForm').reset();
        this.generateSurvey();
        this.attachEventListeners();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.surveyBuilder = new DynamicSurveyBuilder();
});

