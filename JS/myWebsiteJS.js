$(document).ready(function () {
  // Check if savedItems exists in local storage, otherwise initialize it
  if (!localStorage.getItem("savedItems")) {
    localStorage.setItem("savedItems", JSON.stringify([]));
  }

  // Shows user how many items are saved
  function updatedSavedAlert() {
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    alert(
      "You currently have " + savedItems.length + " items saved for later!"
    );
  }

  //"Save for Later" button function
  $(".save_btn").click(function () {
    let itemId = $(this).closest(".item").data("id");
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    // We need to avoid duplicates
    if (!savedItems.includes(itemId)) {
      savedItems.push(itemId);
      localStorage.setItem("savedItems", JSON.stringify(savedItems));
      updatedSavedAlert();
    } else {
      alert("This item has already been saved!");
    }
  });

  // "Like" button function
  $(".like_btn").click(function () {
    alert("You have liked this item!");
  });

  // Comments form submission function
  $("#commentForm").submit(function (e) {
    e.preventDefault();
    let comment = $("#commentText").val().trim();

    if (comment !== "") {
      alert("Thank you for your valued comment!");
      $("#commentText").val(""); // Fixed missing #
    } else {
      alert("You haven't added your comments!");
    }
  });

  // Contact Us Form Function
  $("#contactUsForm").submit(function (e) {
    e.preventDefault();
    let name = $("#name").val();
    let email = $("#email").val();
    let message = $("#message").val();

    if (name && email && message) {
      alert("Thank you " + name + ". We will be in touch soon!");
    } else {
      alert("Please fill in the form!"); // Fixed typo
    }
  });

  // Toggle extra info function
  $("#toggle_btn").click(function () {
    $("#extraInfo").toggle();
  });

  // Drop-down menu function
  $(".dropdown").hover(
    function () {
      $(this).find(".dropdown_content").stop(true, true).slideDown(200);
    },
    function () {
      $(this).find(".dropdown_content").stop(true, true).slideUp(200);
    }
  );

  // Animate the box on click
  $("#animateBox").click(function () {
    $(this).animate({ width: "200px", height: "200px" }, 500);
  });

  // Adding chain effects when double-clicked
  $("#animateBox").dblclick(function () {
    $(this).fadeOut(500).fadeIn(500).slideUp(500).slideDown(500);
  });

  // Show saved items if user is on the Save_for_Later page
  if (window.location.pathname.includes("Save_for_Later.html")) {
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    $("#savedItems").empty();

    if (savedItems.length > 0) {
      savedItems.forEach(function (itemId) {
        $("#savedItems").append("<li>Saved item ID: " + itemId + "</li>");
      });
    } else {
      $("#savedItems").append("<li>No items have been saved as yet.</li>");
    }
  }
});
