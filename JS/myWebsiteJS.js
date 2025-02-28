$(document).ready(function () {
  /*** 🔥 INITIALIZE LOCAL STORAGE IF NOT SET 🔥 ***/
  if (!localStorage.getItem("savedItems")) {
    localStorage.setItem("savedItems", JSON.stringify([]));
  }

  if (!localStorage.getItem("likedItems")) {
    localStorage.setItem("likedItems", JSON.stringify({}));
  }

  if (!localStorage.getItem("comments")) {
    localStorage.setItem("comments", JSON.stringify({}));
  }

  /*** 🔥 SAVE FOR LATER FUNCTIONALITY 🔥 ***/
  $(document).on("click", ".save_btn", function () {
    let section = $(this).closest(".child-section");
    let sectionId = section.data("id");
    let sectionTitle = section.find("h3").text().trim();
    let sectionLink = window.location.href + "#section-" + sectionId;

    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    if (!savedItems.some((item) => item.id === sectionId)) {
      savedItems.push({
        id: sectionId,
        title: sectionTitle,
        link: sectionLink,
      });
      localStorage.setItem("savedItems", JSON.stringify(savedItems));
      alert(`"${sectionTitle}" saved for later!`);
    } else {
      alert(`"${sectionTitle}" is already saved!`);
    }
  });

  /*** 🔥 LOAD SAVED ITEMS FUNCTIONALITY 🔥 ***/
  function loadSavedItems() {
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    let savedList = $("#savedItems");

    savedList.empty();

    if (savedItems.length === 0) {
      savedList.append("<li>No saved items yet.</li>");
      return;
    }

    savedItems.forEach((item, index) => {
      savedList.append(`
        <li class="saved-item">
          <a href="${item.link}">${item.title}</a>
          <button class="remove_btn" data-index="${index}">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </li>
      `);
    });
  }

  /*** 🔥 REMOVE SAVED ITEMS FUNCTIONALITY 🔥 ***/
  $(document).on("click", ".remove_btn", function () {
    let index = $(this).data("index");
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    savedItems.splice(index, 1);
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
    loadSavedItems();
  });

  /*** 🔥 FIXED LIKE & LOVE FUNCTIONALITY 🔥 ***/
  function loadLikes() {
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};

    $(".child-section").each(function () {
      let sectionId = $(this).data("id");
      let likeIcon = $(this).find(".like_btn i");
      let loveIcon = $(this).find(".love_btn i");

      if (likedItems[sectionId] === "like") {
        likeIcon.addClass("fa-solid").css("color", "blue");
        loveIcon.removeClass("fa-solid").css("color", "black");
      } else if (likedItems[sectionId] === "love") {
        loveIcon.addClass("fa-solid").css("color", "red");
        likeIcon.removeClass("fa-solid").css("color", "black");
      } else {
        likeIcon.removeClass("fa-solid").css("color", "black");
        loveIcon.removeClass("fa-solid").css("color", "black");
      }
    });
  }

  $(document).on("click", ".like_btn", function () {
    let section = $(this).closest(".child-section");
    let sectionId = section.data("id");
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};

    if (likedItems[sectionId] === "like") {
      delete likedItems[sectionId];
    } else {
      likedItems[sectionId] = "like";
      if (likedItems[sectionId] === "love") {
        delete likedItems[sectionId]; // Remove Love if previously selected
      }
    }

    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    loadLikes();
  });

  $(document).on("click", ".love_btn", function () {
    let section = $(this).closest(".child-section");
    let sectionId = section.data("id");
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};

    if (likedItems[sectionId] === "love") {
      delete likedItems[sectionId];
    } else {
      likedItems[sectionId] = "love";
      if (likedItems[sectionId] === "like") {
        delete likedItems[sectionId]; // Remove Like if previously selected
      }
    }

    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    loadLikes();
  });

  /*** 🔥 CONTACT US FORM ALERT FUNCTIONALITY 🔥 ***/
  $("#contactUsForm").on("submit", function (e) {
    e.preventDefault();
    let name = $("#name").val().trim();
    let email = $("#email").val().trim();
    let message = $("#message").val().trim();

    if (name !== "" && email !== "" && message !== "") {
      alert(`Thank you, ${name}! Your message has been sent.`);
      $(this)[0].reset(); // Clears the form
    } else {
      alert("Please fill in all fields before submitting.");
    }
  });

  /*** 🔥 COMMENT FUNCTIONALITY 🔥 ***/
  function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || {};

    $(".child-section").each(function () {
      let childName = $(this).find("h3").text().trim();
      let commentList = $(this).find(".commentList");

      commentList.empty();
      if (comments[childName]) {
        comments[childName].forEach((comment, index) => {
          commentList.append(`
            <div class="comment-item">
              <p>${comment}</p>
              <button class="delete-comment" data-child="${childName}" data-index="${index}">
                <i class="fa-solid fa-trash"></i> Remove
              </button>
            </div>
          `);
        });
      }
    });
  }

  $(document).on("submit", ".commentForm", function (e) {
    e.preventDefault();
    let commentText = $(this).find(".commentText").val().trim();
    let childName = $(this).closest(".child-section").find("h3").text().trim();

    if (commentText !== "") {
      let comments = JSON.parse(localStorage.getItem("comments")) || {};
      if (!comments[childName]) {
        comments[childName] = [];
      }
      comments[childName].push(commentText);
      localStorage.setItem("comments", JSON.stringify(comments));

      loadComments();
      $(this).find(".commentText").val("");
    } else {
      alert("Please enter a comment!");
    }
  });

  /*** 🔥 TOGGLE SECTION FUNCTIONALITY 🔥 ***/
  $("#toggle_btn").on("click", function () {
    $("#extraInfo").toggle(300);
    let buttonText =
      $(this).text() === "Show/Hide Extra Info"
        ? "Hide Extra Info"
        : "Show/Hide Extra Info";
    $(this).text(buttonText);
  });

  /*** 🔥 ANIMATE BOX FUNCTIONALITY 🔥 ***/
  $("#animateBox").on("click", function () {
    $(this)
      .animate(
        { width: "200px", height: "200px", backgroundColor: "#ff5733" },
        500
      )
      .animate(
        {
          width: "100px",
          height: "100px",
          backgroundColor: "rgb(115, 32, 117)",
        },
        500
      );
  });

  $("#animateBox").on("dblclick", function () {
    $(this).fadeOut(300).fadeIn(300);
  });

  /*** 🔥 INITIALIZE EVERYTHING ON PAGE LOAD 🔥 ***/
  if (window.location.pathname.includes("Save_for_Later.html")) {
    loadSavedItems();
  }
  loadLikes();
  loadComments();
});
