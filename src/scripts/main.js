$(document).ready(function() {

    //Submit button handler
    var searchBox = $('#search-term'),
        resultsList = $('#results-list'),
        savedSearches = $('.saved-searches'),
        resultsTemplate = Handlebars.compile($('#result-template').html()),
        savedSearchTemplate = Handlebars.compile($('#saved-search-template').html());
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        var searchItem = {
            "searchTerm": searchBox.val()
        };
        $.ajax({
            "url": 'http://localhost:9000/wikiview',
            "method": "POST",
            "data": JSON.stringify(searchItem),
            "dataType": "json",
            "contentType": "application/json"
        }).done(function(data) {
            searchBox.val('');
            data.forEach(function(result) {
                resultsList.append(resultsTemplate(result));
            });
            savedSearches.append(savedSearchTemplate(searchItem));
        }).fail(function(error) {
            console.log("There was an error", error);
        });
    });
    //Delegate action for deleting saved searches

});
