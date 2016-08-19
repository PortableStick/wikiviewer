//Submit button handler
$('#search-form').on('submit', function(event) {
    event.preventDefault();
    var searchItem = {
        "searchTerm": $('#search-term').val()
    };
    $.ajax({
        "url": 'http://localhost:9000/wikiview',
        "method": "POST",
        "data": JSON.stringify(searchItem),
        "dataType": "json",
        "contentType": "application/json"
    }).done(function(data) {
        var resultsList = $("#results-list"),
            resultsTemplate = Handlebars.compile($('#result-template').html());
        data.forEach(function(result) {
            resultsList.append(resultsTemplate(result));
        });
    }).fail(function(error) {
        console.log("There was an error", error);
    });
});
//Delegate action for deleting saved searches

