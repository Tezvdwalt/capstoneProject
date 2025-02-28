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
  $(".save_btn").click(function () {
    let section = $(this).closest(".child-section");
    let sectionId = section.data("id");
    let sectionTitle = section.find("h3").text().trim();
    let sectionLink = window.location.href + "#section-" + sectionId;

    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    // Avoid duplicates
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

  /*** 🔥 LOAD SAVED ITEMS ON "SAVE FOR LATER" PAGE 🔥 ***/
  function loadSavedItems() {
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    $("#savedItems").empty();

    if (savedItems.length > 0) {
      savedItems.forEach(function (item, index) {
        $("#savedItems").append(`
          <li class="saved-item">
            <a href="${item.link}">${item.title}</a>
            <button class="remove_btn" data-index="${index}">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </li>
        `);
      });
    } else {
      $("#savedItems").append("<li>No items have been saved yet.</li>");
    }
  }

  /*** 🔥 REMOVE SAVED ITEM 🔥 ***/
  $(document).on("click", ".remove_btn", function () {
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    let itemIndex = $(this).data("index");

    savedItems.splice(itemIndex, 1);
    localStorage.setItem("savedItems", JSON.stringify(savedItems));

    loadSavedItems();
  });

  /*** 🔥 LOAD COMMENTS 🔥 ***/
  function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || {};

    $(".child-section").each(function () {
      let childName = $(this).find("h3").text().trim();
      let commentList = $(this).find(".commentList");

      if (!commentList.length) {
        $(this).append("<div class='commentList'></div>");
        commentList = $(this).find(".commentList");
      }

      commentList.empty(); // Clear before appending
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

  /*** 🔥 COMMENT SUBMISSION 🔥 ***/
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

  /*** 🔥 DELETE COMMENTS 🔥 ***/
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
  loadComments();
});
