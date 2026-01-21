class RegistrationValidator {
    constructor() {
        this.validationRules = {
            student: {
                passwordMinLength: 8,
                passwordRequirements: 'At least 8 characters',
                ageMin: 13,
                skillsRequired: true
            },
            teacher: {
                passwordMinLength: 10,
                passwordRequirements: 'At least 10 characters + 1 number',
                ageMin: 21,
                skillsRequired: true
            },
            admin: {
                passwordMinLength: 12,
                passwordRequirements: 'At least 12 chars + uppercase + number + special char',
                ageMin: 25,
                skillsRequired: true
            }
        };
        this.currentRole = '';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.validateAllFields();
    }

    attachEventListeners() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        document.getElementById('role').addEventListener('change', (e) => {
            this.handleRoleChange(e.target.value);
        });

        document.querySelectorAll('.skill-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateSkills());
        });

        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.isFormValid()) {
                this.handleSubmit();
            }
        });
    }

    handleRoleChange(role) {
        this.currentRole = role;
        this.updateSkillsVisibility();
        this.updatePasswordRequirements();
        this.validateAllFields();
    }

    updateSkillsVisibility() {
        const skillsGroup = document.getElementById('skillsGroup');
        skillsGroup.classList.toggle('hidden', !this.currentRole || !this.validationRules[this.currentRole]?.skillsRequired);
    }

    updatePasswordRequirements() {
        const passwordError = document.getElementById('passwordError');
        if (this.currentRole && this.validationRules[this.currentRole]) {
            passwordError.textContent = this.validationRules[this.currentRole].passwordRequirements;
        }
    }

    validateField(field) {
        const fieldName = field.id;
        let isValid = true;
        let errorMessage = '';

        switch(fieldName) {
            case 'name':
                isValid = this.validateName(field.value);
                errorMessage = isValid ? '' : 'Name must be 2-50 characters';
                break;
            case 'email':
                isValid = this.validateEmail(field.value);
                errorMessage = isValid ? '' : 'Please enter a valid educational email (e.g., .edu, .ac.in)';
                break;
            case 'password':
                isValid = this.validatePassword(field.value);
                break;
            case 'confirmPassword':
                isValid = this.validateConfirmPassword(field.value, document.getElementById('password').value);
                errorMessage = isValid ? '' : 'Passwords do not match';
                break;
            case 'age':
                isValid = this.validateAge(field.value);
                break;
            case 'role':
                isValid = !!field.value;
                errorMessage = isValid ? '' : 'Please select a role';
                break;
        }

        this.showFieldFeedback(field, isValid, errorMessage);
        this.toggleSubmitButton();
    }

    validateName(name) {
        return name.length >= 2 && name.length <= 50;
    }

    validateEmail(email) {
        const eduDomains = ['.edu', '.ac.in', '.edu.in', '.university', 'university', 'college'];
        const domain = email.substring(email.lastIndexOf('.'));
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
               eduDomains.some(domainPattern => domain.includes(domainPattern));
    }

    validatePassword(password) {
        if (!this.currentRole) return false;
        const rules = this.validationRules[this.currentRole];
        
        if (password.length < rules.passwordMinLength) return false;
        
        switch(this.currentRole) {
            case 'student':
                return /[a-zA-Z]/.test(password);
            case 'teacher':
                return /\d/.test(password);
            case 'admin':
                return /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password);
            default:
                return false;
        }
    }

    validateConfirmPassword(confirmPass, password) {
        return confirmPass === password;
    }

    validateAge(age) {
        if (!this.currentRole || !age) return false;
        return parseInt(age) >= this.validationRules[this.currentRole].ageMin;
    }

    validateSkills() {
        if (!this.currentRole || !this.validationRules[this.currentRole]?.skillsRequired) return true;
        
        const checkedSkills = document.querySelectorAll('.skill-checkbox:checked');
        const isValid = checkedSkills.length > 0;
        const errorEl = document.getElementById('skillsError');
        
        errorEl.textContent = isValid ? '' : 'Please select at least one skill';
        errorEl.classList.toggle('show', !isValid);
        
        return isValid;
    }

    validateAllFields() {
        document.querySelectorAll('input, select').forEach(field => {
            this.validateField(field);
        });
        this.validateSkills();
    }

    showFieldFeedback(field, isValid, errorMsg = '') {
        const container = field.parentElement;
        const errorEl = container.querySelector('.error-message');
        
        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid);
        
        if (errorEl) {
            errorEl.textContent = errorMsg;
            errorEl.classList.toggle('show', !isValid && errorMsg);
        }
    }

    isFormValid() {
        const allFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        allFields.forEach(field => {
            if (!field.value) isValid = false;
        });
        
        isValid = isValid && this.validateSkills();
        document.querySelectorAll('input, select').forEach(field => {
            if (field.classList.contains('error')) isValid = false;
        });
        
        return isValid;
    }

    toggleSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = !this.isFormValid();
    }

    handleSubmit() {
        const formData = new FormData(document.getElementById('registrationForm'));
        const data = Object.fromEntries(formData);
        data.skills = Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(cb => cb.value);
        
        alert('Registration successful!\n' + JSON.stringify(data, null, 2));
        document.getElementById('registrationForm').reset();
        document.getElementById('submitBtn').disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegistrationValidator();
});
