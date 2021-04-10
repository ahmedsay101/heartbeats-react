import axios from 'axios';
import $ from 'jquery';

export const randomNum = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const changeLike = (songId, isLiked) => {
	return new Promise(resolve => {
		if (authStorageExist()) {
			const userId = localStorage.getItem("userId");
			const requestMethod = (isLiked ? "DELETE": "POST");
			const requestUrl = (requestMethod === "POST" ? "users/"+userId+"/likes": "users/"+userId+"/likes/"+songId);
			const requestBody = (requestMethod === "POST" ? JSON.stringify({
				songId: songId
			}) : "")
			axios({
				method: requestMethod,
				headers: {
					'Content-Type': 'application/json'
				},
				url: requestUrl,
				data: requestBody
			})
			.then(res => {
				if(res.status === 200 || res.status === 201) {
					const likeEvent = new CustomEvent('like', {
						detail: {
							id: songId,
							like: requestMethod.toLocaleLowerCase() === 'post'
						}
					});
					window.dispatchEvent(likeEvent);
					resolve({
						error: false,
						status: res.status,
						change: true,
						like: requestMethod.toLocaleLowerCase() === 'post'
					});
				}
				else if(res.status === 401) {
					resolve({
						error: true,
						status: res.status,
						msg: 'Please Login Or Register To Like A Song',
						change: false,
						like: isLiked
					});
				}
			})
			.catch(err => { 
				console.log(err)
				if(err.response.status === 401) {
					resolve({
						error: true,
						status: err.response.status,
						msg: 'Please Login Or Register To Like A Song',
						change: false,
						like: isLiked
					});
				}
				resolve({
					error: true,
					status: err.response.status,
					msg: 'Something Went Wrong, Please Try Again Later',
					change: false,
					like: isLiked
				})
			});
		}
		else {
			resolve({
				error: true,
				status: 401,
				msg: 'Please Login Or Register To Like A Song',
				change: false,
				like: isLiked
			});	
		}
	});
}

export const isAuthenticated = async () => {
	return new Promise(resolve => {
		if (authStorageExist()) {
			axios({method: 'GET', url:`sessions/${localStorage.getItem('sessId')}`}).then(res => {
				console.log(res);
				console.log(res.data.data + " ** " + localStorage.getItem('userId'));
				if(res.status === 200 && res.data.data == localStorage.getItem('userId')) { 
					resolve(true);
					const updateEvent = new CustomEvent('userShouldUpdate');
					window.dispatchEvent(updateEvent);
				}
				else {
					authFailed();
					const updateEvent = new CustomEvent('userShouldUpdate');
					window.dispatchEvent(updateEvent);
					resolve(true);
				}
			})
			.catch(err => {
				console.log(err);
				authFailed();
				const updateEvent = new CustomEvent('userShouldUpdate');
				window.dispatchEvent(updateEvent);
				resolve(false);
			});
		}
		else {
			authFailed();
			resolve(false);
		}
	});

}

export const authStorageExist = () => {
	if (localStorage.getItem("sessId") === null || localStorage.getItem("accessToken") === null || localStorage.getItem("userId") === null) {
		clearAuthStorage();
		return false;
	}
	else {
		return true;
	}
}

export const logout = async () => {
	return new Promise(resolve => {
		axios({method: 'DELETE', url: `sessions/${localStorage.getItem('sessId')}`}).then(res => {
			authFailed();
			const updateEvent = new CustomEvent('userShouldUpdate');
			window.dispatchEvent(updateEvent);
			resolve();
		}).catch(err => {
			authFailed();
			const updateEvent = new CustomEvent('userShouldUpdate');
			window.dispatchEvent(updateEvent);
			resolve();
		});
	});
}

export const authFailed = () => {
	clearAuthStorage();
}

export const clearAuthStorage = () => {
	localStorage.removeItem("sessId");
	localStorage.removeItem("accessToken");
	localStorage.removeItem("userId");
}

export const checkValidity = (value, rules) => {
	let isValid = true;
	let msg = "";
	
	if (rules.required) {
		isValid = value.trim() !== '' && isValid;
		if(!isValid) {
			msg = "This input can't be empty";
			return {
				isValid: isValid,
				msg: msg
			}
		}
	}

	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
		if(!isValid) {
			msg = "Please enter a value longer than " + rules.minLength + " characters";
			return {
				isValid: isValid,
				msg: msg
			}
		}
	}

	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid;
		if(!isValid) {
			msg = "Please enter a value less than " + rules.maxLength + " characters";
			return {
				isValid: isValid,
				msg: msg
			}
		}
	}

	return {
		isValid: isValid,
		msg: msg
	}
}
export const calculateOptionsPosition = (emitter, numOfOptions, fixed = null) => {
	const optionHeight = 40;
	const optionWidth = 150;
	const optionsHeight = numOfOptions * optionHeight;
	const scrolled = $(window).scrollTop();
	let top = $(emitter).offset().top + $(emitter).height();
	const left = $(emitter).offset().left - optionWidth;
	const fromWindowTop = (top - scrolled);
	const windowHeight = $(window).height();
	const shouldAppearAbove = windowHeight - fromWindowTop < (optionsHeight);

	if(shouldAppearAbove) top = top - optionsHeight;

	if(fixed) {
		top = top - scrolled;
	}

	return {
		top: top,
		left: left
	}
}