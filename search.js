let queryParams = getUrlVars();

var query = "";
for (var prop in queryParams) {
  query += `&${prop}=${queryParams[prop]}`;
}

var eventSearchUrl = `https://api.ingresse.com/v2/events/search/1/?${query}&from=now-6h&size=600&offset=`;

loadEvents();

function loadEvents(page = 0) {
  $.ajax({
    url: eventSearchUrl + page * 600,
    type: "GET",
    dataType: "json",
    success: function(data, textStatus, xhr) {
      let events = data.data.hits;
      let eventCoords = [];
      for (i = 0; i < events.length; i++) {
        const date = new Date(events[i]._source.sessions[0].dateTime);

        $("#events").append(`
          <a href="https://ingresse.com/${
            events[i]._source.slug
          }" target="_blank">
            <div class="event-box">
              <img
                loading="lazy"
                src="${events[i]._source.poster.large}"
                width="200px"
                alt="evento ${events[i]._source.title}"
              />
              <p class="title">${events[i]._source.title}</p>
              <p class="date">${new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short"
              }).format(date)}</p>
            </div>
          </a>
        `);
      }
      if (events.length > 0) {
        loadEvents(page + 1);
      }
    },
    error: function(xhr, textStatus, errorThrown) {}
  });
}

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    if (hash[1]) vars[hash[0]] = hash[1];
  }
  return vars;
}
