function Validator(options) {
    var selectorRules = {}

    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        //Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule và check
        for(var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            //Nếu có lỗi thì dừng check
            if(errorMessage) break;
        }
                    if(errorMessage) {
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid')
                    } else {
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid')
                    }
        return !errorMessage;
    }
    // Lấy element của form
    var formElement = document.querySelector(options.form);
    if(formElement) {

        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            //Lặp qua từng rules và validate
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            }); 
            var enableInput = formElement.querySelectorAll('[name]')
            console.log(enableInput)
            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {
                    options.onSubmit({
                        name: 'Xuân Tùng'
                    })
                }
            }
            

        }

        // Lặp qua mỗi rule và xử lý (lắng nghe onblur, onclick,...)
        options.rules.forEach(rule => {

            //Lưu lại rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            

            var inputElement = formElement.querySelector(rule.selector) 
            if(inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                     errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                    // inputElement.parentElement.classList.add('not-invalid')   
                }
            }
        });

    }
}


// Định nghĩa rules
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}
Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        }
    }
}
Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Gía trị nhập vào không chính xác'
        }
    }
}