$(document).ready(function () {
  // Initialize local storage if it doesn't exist
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

  /*** 🔥 LIKE & LOVE FUNCTIONALITY 🔥 ***/
  function loadLikes() {
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};

    $(".child-section").each(function () {
      let sectionId = $(this).data("id");
      let likeIcon = $(this).find(".like_btn i");
      let loveIcon = $(this).find(".love_btn i");

      if (likedItems[sectionId] === "like") {
        likeIcon
          .removeClass("fa-regular")
          .addClass("fa-solid fa-thumbs-up")
          .css("color", "blue");
        loveIcon
          .removeClass("fa-solid fa-heart")
          .addClass("fa-regular fa-heart")
          .css("color", "black");
      } else if (likedItems[sectionId] === "love") {
        loveIcon
          .removeClass("fa-regular")
          .addClass("fa-solid fa-heart")
          .css("color", "red");
        likeIcon
          .removeClass("fa-solid fa-thumbs-up")
          .addClass("fa-regular fa-thumbs-up")
          .css("color", "black");
      } else {
        likeIcon
          .removeClass("fa-solid fa-thumbs-up")
          .addClass("fa-regular fa-thumbs-up")
          .css("color", "black");
        loveIcon
          .removeClass("fa-solid fa-heart")
          .addClass("fa-regular fa-heart")
          .css("color", "black");
      }
    });
  }

  $(document).on("click", ".like_btn", function () {
    let section = $(this).closest(".child-section");
    let sectionId = section.data("id");
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};
    let likeIcon = $(this).find("i");
    let loveIcon = section.find(".love_btn i");

    if (likedItems[sectionId] === "like") {
      delete likedItems[sectionId];
      likeIcon
        .removeClass("fa-solid fa-thumbs-up")
        .addClass("fa-regular fa-thumbs-up")
        .css("color", "black");
    } else {
      likedItems[sectionId] = "like";
      likeIcon
        .removeClass("fa-regular fa-thumbs-up")
        .addClass("fa-solid fa-thumbs-up")
        .css("color", "blue");
      loveIcon
        .removeClass("fa-solid fa-heart")
        .addClass("fa-regular fa-heart")
        .css("color", "black");
      delete likedItems[sectionId]; // Remove Love if previously selected
    }

    localStorage.setItem("likedItems", JSON.stringify(likedItems));
  });

  $(document).on("click", ".love_btn", function () {
    let section = $(this).closest(".child-section");
    let sectionId = section.data("id");
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};
    let loveIcon = $(this).find("i");
    let likeIcon = section.find(".like_btn i");

    if (likedItems[sectionId] === "love") {
      delete likedItems[sectionId];
      loveIcon
        .removeClass("fa-solid fa-heart")
        .addClass("fa-regular fa-heart")
        .css("color", "black");
    } else {
      likedItems[sectionId] = "love";
      loveIcon
        .removeClass("fa-regular fa-heart")
        .addClass("fa-solid fa-heart")
        .css("color", "red");
      likeIcon
        .removeClass("fa-solid fa-thumbs-up")
        .addClass("fa-regular fa-thumbs-up")
        .css("color", "black");
      delete likedItems[sectionId]; // Remove Like if previously selected
    }

    localStorage.setItem("likedItems", JSON.stringify(likedItems));
  });

  /*** 🔥 COMMENT FUNCTIONALITY 🔥 ***/
  function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || {};

    $(".child-section").each(function () {
      let childName = $(this).find("h3").text().trim();
      let commentList = $(this).find(".commentList");

      if (!commentList.length) {
        $(this).append("<div class='commentList'></div>");
        commentList = $(this).find(".commentList");
      }

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
    let commentList = $(this).closest(".child-section").find(".commentList");

    if (!commentList.length) {
      $(this)
        .closest(".child-section")
        .append("<div class='commentList'></div>");
      commentList = $(this).closest(".child-section").find(".commentList");
    }

    if (commentText !== "") {
      let comments = JSON.parse(localStorage.getItem("comments")) || {};
      if (!comments[childName]) {
        comments[childName] = [];
      }
      comments[childName].push(commentText);
      localStorage.setItem("comments", JSON.stringify(comments));

      commentList.append(`
        <div class="comment-item">
          <p>${commentText}</p>
          <button class="delete-comment" data-child="${childName}" data-index="${
        comments[childName].length - 1
      }">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
      `);

      $(this).find(".commentText").val(""); // Clear input field
    } else {
      alert("Please enter a comment!");
    }
  });

  $(document).on("click", ".delete-comment", function () {
    let childName = $(this).data("child");
    let commentIndex = $(this).data("index");
    let comments = JSON.parse(localStorage.getItem("comments")) || {};

    if (comments[childName]) {
      comments[childName].splice(commentIndex, 1);
      localStorage.setItem("comments", JSON.stringify(comments));
      loadComments();
    }
  });

  /*** 🔥 INITIALIZE EVERYTHING ON PAGE LOAD 🔥 ***/
  if (window.location.pathname.includes("Save_for_Later.html")) {
    loadSavedItems();
  }
  loadLikes();
  loadComments();
});
