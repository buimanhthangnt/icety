
function getDate(datetime) {
if (!datetime) datetime = new Date()
let day = datetime.getDate()
if (day < 10) day = "0" + day;
let month = datetime.getMonth() + 1
if (month < 10) month = "0" + month;
let year = datetime.getFullYear()
return "" + day + "/" + month + "/" + year + "";
}
function getTime(datetime) {
if (!datetime) datetime = new Date()
let hour = datetime.getHours();
if (hour < 10) hour = "0" + hour;
let minute = datetime.getMinutes() + 1
if (minute < 10) minute = "0" + minute;
return "" + hour + ":" + minute + "";
}

let todos = window.localStorage.getItem('todos') || "[]";
todos = JSON.parse(todos)
let textColor = window.localStorage.getItem('color') || "black";

$(document).ready(function($) {
	"use strict";
	let url = window.localStorage.getItem('url');
	url = (url) ? url : defaultImage;
	$(".site-blocks-cover").css("background-image", 'url('+ url +')');

	$(".site-blocks-cover").addClass("start_fade");

	function setNotitext () {
		let filtered = todos.filter(t => {
			if (t.done) return false;
			let current = new Date();
			let current_date = getDate(current).split('/').reverse().join('/');
			let t_date = t.date.split('/').reverse().join('/');
			return current_date > t_date || (current_date == t_date && getTime(current) > t.time)
		});
		if (filtered.length == 0) {
			$("#noti").text("You have nothing to do now");
		} else {
			$("#noti").text(`You have ${filtered.length} things to do`);
		}
	}

	setNotitext();

	$("#todo-add-submit").on('click', function (e) {
		e.preventDefault();
		let title = $("#todo-add-title").val();
		if (title.trim() == "") return;
		$("#todo-add-title").val("")
		let datetime = new Date($("#todo-add-datetime").val());
		if (datetime == "Invalid Date") datetime = new Date();
		$("#todo-add-datetime").val(null);
		let todo = {
			title: title,
			date: getDate(datetime),
			time: getTime(datetime),
			done: false
		}
		handleAdd(todo);
	})

	function update(todos, oldTodos) {
		if (!oldTodos) oldTodos = todos;
		for (let i = 0; i < oldTodos.length; i++) {
			$(`#todo-${i}`).remove();
		}
		window.localStorage.setItem('todos', JSON.stringify(todos));
		renderTodos(todos);
	}

	function handleAdd(todo) {
		todos.push(todo);
		update(todos);
		setNotitext();
	}

	function handleDelete(index) {
		$(`#todo-${index}`).css("transform", "translate(100%, 0%)")
											.css("transition", "all 800ms ease")
		setTimeout(function () {
			let new_todos = todos.filter((t, i) => i != index);
			update(new_todos, todos);
			todos = new_todos;
			setNotitext();
		}, 600);
	}

	function handleDone(index) {
		todos = todos.map((t, i) => {
			if (i != index) return t;
			else {
				t.done = true;
				return t;
			}
		})
		congratulate()
		setNotitext();
		update(todos);
	}

	function renderTodos(todos) {
		todos = todos.sort((t1, t2) => {
			return t1.date < t2.date && t1.time < t2.time;
		});
		for (let i = 0; i < todos.length; i++) {
			let todo = todos[i];
			let title = todo.title;
			let date = todo.date;
			let time = todo.time;
			let tag = todo.done ? "Completed" : "Todo";
			let strEle = `<div id=\"todo-${i}\" class=\"row\"><div class=\"col-md-2\"></div><div class=\"col-md-8\"><div class=\"job-post-item bg-white p-4 d-block d-md-flex align-items-center\"><div class=\"mb-4 mb-md-0 mr-5\" style=\"flex: 1; overflow: hidden\"><div class=\"job-post-item-header d-flex align-items-center\"><h2 class=\"mr-3 text-black h4\">${title}</h2><div class=\"badge-wrap\"><span class=\"${todo.done ? "bg-success" : "bg-warning"} text-white badge\" style=\"padding: 6px 12px !important\">${tag}</span></div></div><div class=\"job-post-item-body d-block d-md-flex\"><div class=\"mr-5\"><span class=\"fl-bigmug-line-portfolio23\"></span> ${date}</div><div><span class=\"fl-bigmug-line-big104\"></span> <span>${time}</span></div></div></div><div class=\"ml-auto\"><span id="todo-delete-${i}" class=\"btn btn-secondary rounded-circle btn-favorite text-gray-500\" style=\"margin-right: 30px !important; color: white !important; border-color: #f23a2e; background: #f23a2e;\"><span class=\"icon-trash\"></span></span><button class=\"btn btn-primary py-2\" ${todo.done ? "disabled" : ""} id="todo-done-${i}">Done</button></div></div></div><div class=\"col-md-2\"></div></div>`;
			$("#todoslist").append($(strEle));
		}
		for (let i = 0; i < todos.length; i++) {
			$(`#todo-done-${i}`).on('click', function() {handleDone(i)});
			$(`#todo-delete-${i}`).on('click', function() {handleDelete(i)});
		}
	}

	renderTodos(todos);

	$(".toggle_icon").on('click', function () {
			$('.right_fix_bar').toggleClass("open_sidebar");
			$('.site-wrap').toggleClass('opacity-1');
			$(".toggle_icon").toggleClass('opacity-1');
			setTimeout(function() {
				$(".toggle_icon").toggleClass('opacity-1');
			}, 300);
	});

	$("#pills-job-tab").on('click', function() {
		$('#pills-tabContent').toggleClass('tab-content-faded');
	});

	$("#btn-restore").on('click', function(e) {
		e.preventDefault();
		window.localStorage.clear();
		alert("Restored default settings. Refresh to see affects.")
	});

	$("#noti").on('click', function() {
		$("#myContainer").show();
		setTimeout(function () {
			$('html, body').animate({
					scrollTop: $(".site-blocks-cover").height()
			}, 500);
		}, 50);
	});

	$('#btn-save-name').on('click', function(e) {
		e.preventDefault();
		let username = $('#username-input').val();
		window.localStorage.setItem('username', username);
		$('#username-input').val("");
		$("#welcome-text").text("Hi, " + username);
		alert("Set your name successfully")
	});

	let username = window.localStorage.getItem('username');
	$("#welcome-text").text((username ? ("Hi, " + username) : "Welcome"));

	$("#btn-change-bg").on('click', function(e) {
		e.preventDefault();
		let url = $("#image-url").val();
		if (url.trim() == "") {
			return;
		}
		$(".site-blocks-cover").css("background-image", 'url('+ url +')');
		window.localStorage.setItem('url', url);
		$("#image-url").val("")
	});
	$("#image-url").change(function () {
		if ($("#image-url")[0].files.length == 0) return;
		let reader = new FileReader();
		reader.readAsDataURL($("#image-url")[0].files[0]);
		reader.onload = function () {
			url = reader.result;
			$(".site-blocks-cover").css("background-image", 'url('+ url +')');
			window.localStorage.setItem('url', url);
		};
	});
	$("#text-area").addClass(`text-${textColor}`);
	$("#btn-text-color").on('click', function () {
		$("#text-area").removeClass(`text-${textColor}`);
		if (textColor == "black") textColor = "white";
		else textColor = "black";
		window.localStorage.setItem('color', textColor);
		$("#text-area").addClass(`text-${textColor}`);
		alert("Changed text color to " + textColor);
	});


	let particles = ['.blob', '.star'],
	 $congratsSection = $('#congrats'),
	 $title = $('#title');


	// Congratulation
	// $congratsSection.click(fancyPopIn);
	init({
		numberOfStars: 20,
		numberOfBlobs: 8
	});
	function congratulate() {
		let congrats = ['well done!', 'good job!', 'keep going!', 'impressive!', 'excellent!', 'awesome!', 'great!']
		let rand_int = Math.floor(Math.random() * congrats.length);
		$("#congrats").css('visibility', 'visible').css('top', `calc(40% + ${$(window).scrollTop()}px)`);
		$("#title_congrat").text(congrats[rand_int]);
		fancyPopIn();
		setTimeout(function () {
			$("#congrats").css('visibility', 'hidden');
		}, 1000);
	}

	function fancyPopIn() {
		reset();
		animateText();
		
		for (let i = 0, l = particles.length; i < l; i++) {
			animateParticles(particles[i]);
		}
	}

	function animateText() {
		TweenMax.from($title, 0.65, {
			scale: 0.4,
			opacity: 0,
			rotation: 15,
			ease: Back.easeOut.config(5),
		});
	}

	function animateParticles(selector) {
		let xSeed = _.random(350, 380);
		let ySeed = _.random(120, 170);
		
		$.each($(selector), function(i) {
			let $particle = $(this);
			let speed = _.random(1, 4);
			let rotation = _.random(20, 100);
			let scale = _.random(0.8, 1.5);
			let x = _.random(-xSeed, xSeed);
			let y = _.random(-ySeed, ySeed);

			TweenMax.to($particle, speed, {
				x: x,
				y: y,
				ease: Power1.easeOut,
				opacity: 0,
				rotation: rotation,
				scale: scale,
				onStartParams: [$particle],
				onStart: function($element) {
					$element.css('display', 'block');
				},
				onCompleteParams: [$particle],
				onComplete: function($element) {
					$element.css('display', 'none');
				}
			});
		});
	}

	function reset() {
		for (let i = 0, l = particles.length; i < l; i++) {
			$.each($(particles[i]), function() {
				TweenMax.set($(this), { x: 0, y: 0, opacity: 1 });
			});
		}
		
		TweenMax.set($title, { scale: 1, opacity: 1, rotation: 0 });
	}

	function init(properties) {
		for (let i = 0; i < properties.numberOfStars; i++) {
		$congratsSection.append('<div class="particle star fa fa-star ' + i + '"></div>');
		}
		
		for (let i = 0; i < properties.numberOfBlobs; i++) {
		$congratsSection.append('<div class="particle blob ' + i + '"></div>');
		}	
	}
});