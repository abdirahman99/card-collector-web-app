(function ($) {
  $(function () {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");
    const requests = new Set();
    const friends = new Set();
    if (user) {
      $(".not-isloggedin").hide();
    } else {
      $(".isloggedin").hide();
    }

    if (user) {
      $("#username").text(user.username);
      $("#logout").click(function () {
        sessionStorage.clear();
        window.location = "http://localhost:3000/login";
      });
      user.friends.forEach((frnd) => {
        $.ajax({
          url: `http://localhost:3000/api/user/${frnd}`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: function (res) {
            console.log(res);
            $("#trade-friends").prepend(`<div class="form-check">
            <input class="form-check-input" type="radio" value="" id="${res.data.username}">
            <label class="form-check-label" for="${res.data.username}">
            ${res.data.username}
            </label>
          </div>`);
          },
          error: function () {},
        });
      });
      user.cards.forEach((frnd) => {
        console.log(frnd);
        $("#trade-cards").prepend(`<div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="${frnd.name}">
        <label class="form-check-label" for="${frnd.name}">
        ${frnd.name}
        </label>
      </div>`);
      });
      setInterval(() => {
        $.ajax({
          url: `http://localhost:3000/api/friends/request`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("token")
            );
          },
          success: function (res) {
            res.data.forEach((el) => {
              requests.add(JSON.stringify(el));
            });
            var user = JSON.parse(sessionStorage.getItem("user"));
            var html = "";
            requests.forEach((qer) => {
              var req = JSON.parse(qer);
              if (req.status === "pending" && req.recipient._id === user._id) {
                html =
                  html +
                  `<li class="list-group-item">
                      <div class="d-flex justify-content-between">
                      <p>${req.sender.username}</p>
                      <input type="text" value="${req.sender._id}" class="requestkey" style="display: none;" />
                      <div>
                      <button class="btn btn-primary m-1 friendrequest accept">
                          Accept
                      </button>
                      <button class="btn btn-danger m-1 friendrequest decline">
                          Decline
                      </button>
                      </div>
                  </div>
              </li>`;
              }
            });
            $("#requestfriendsoutput").html(html);
          },
          error: function () {},
        });
      }, 10000);
    }
    $("#signup-btn").click(function (event) {
      var username = $("#signup #username").val();
      var password = $("#signup #password").val();
      $.post(
        "http://localhost:3000/api/signup",
        { username, password },
        function (data, status) {
          if (status === "success") {
            sessionStorage.setItem("user", JSON.stringify(data.data));
            sessionStorage.setItem("token", data.token);
            window.location = "http://localhost:3000";
          }
        }
      );
    });
    $("#login-btn").click(function (event) {
      var username = $("#login #username").val();
      var password = $("#login #password").val();
      console.log(username, password);
      $.post(
        "http://localhost:3000/api/login",
        { username, password },
        function (data, status) {
          if (status === "success") {
            sessionStorage.setItem("user", JSON.stringify(data.data));
            sessionStorage.setItem("token", data.token);
            window.location = "http://localhost:3000";
          }
        }
      );
    });
    $("#searchfriends").keyup(function () {
      var token = sessionStorage.getItem("token");
      if (token) {
        var val = encodeURI($("#searchfriends").val());
        if (val) {
          $.ajax({
            url: `http://localhost:3000/api/user/search?search=${val}`,
            type: "GET",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (res) {
              $("#searchfriendsoutput").html(
                res.data.map(
                  (user) => `<li class="list-group-item">
                                      <div class="d-flex justify-content-between">
                                      <p>${user.username}</p>
                                      <input type="text" value="${user._id}" class="requestkey" style="display: none;" />
                                      <button class="btn btn-primary sendfriendrequest">
                                          Send Request
                                      </button>
                                      </div>
                                  </li>`
                )
              );
            },
            error: function () {},
          });
        } else {
          $("#searchfriendsoutput").empty();
        }
      } else {
        window.location = "http://localhost:3000/login";
      }
    });
    $("#searchfriendsoutput").on("click", ".sendfriendrequest", function () {
      var token = sessionStorage.getItem("token");
      var val = $(this).siblings(".requestkey").val();
      $.ajax({
        url: `http://localhost:3000/api/friends/request/${val}`,
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (res) {
          console.log(res);
          var data = res.data;
          if (
            data.status === "pending" &&
            data.recipient._id === sessionStorage.getItem("user")._id
          ) {
            $("#requestfriendsoutput").prepend(
              `<li class="list-group-item">
                  <div class="d-flex justify-content-between">
                  <p>${data.sender.username}</p>
                  <input type="text" value="${data.recipient._id}" class="requestkey" style="display: none;" />
                  <div>
                  <button class="btn btn-primary m-1 friendrequest accept">
                      Accept
                  </button>
                  <button class="btn btn-danger m-1 friendrequest decline">
                      Decline
                  </button>
                  </div>
              </div>
          </li>`
            );
          }
        },
        error: function () {},
      });
    });
    $("#requestfriendsoutput").on("click", ".friendrequest", function () {
      var status = $(this).hasClass("accept") ? "accepted" : "declined";
      var token = sessionStorage.getItem("token");
      var val = $(this).parent().siblings(".requestkey").val();
      console.log(val);
      $.ajax({
        url: `http://localhost:3000/api/friends/request-response/${val}`,
        type: "PUT",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (res) {
          console.log(res, status);
          if (status === "declined") {
            $.ajax({
              url: `http://localhost:3000/api/friends/request/${res.data._id}`,
              type: "DELETE",
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
              },
              success: function (data) {
                console.log(data);
              },
            });
          } else if (status === "accepted") {
            $.ajax({
              url: `http://localhost:3000/api/user/${user._id}`,
              type: "PUT",
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
              },
              data: {
                friends: res.data.sender._id,
              },
              success: function (data) {
                console.log(user.friends.concat(res.data.sender._id));
                console.log(data);
              },
            });
            $.ajax({
              url: `http://localhost:3000/api/user/${res.data.sender._id}`,
              type: "PUT",
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
              },
              data: {
                friends: user._id,
              },
              success: function (data) {
                console.log(user.friends.concat(user._id));
                console.log(data);
              },
            });
            $.ajax({
              url: `http://localhost:3000/api/friends/request/${res.data._id}`,
              type: "DELETE",
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
              },
              success: function (data) {
                console.log(data);
              },
            });
          }
        },
        data: { ...status },
        error: function () {},
      });
    });
  });
})(jQuery);
