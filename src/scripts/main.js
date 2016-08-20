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
        handleSearching(searchItem).done(function(data) {
            resultsList.html('');
            data.forEach(function(result) {
                resultsList.append(resultsTemplate(result));
            });
            savedSearches.append(savedSearchTemplate(searchItem));
            searchBox.val('');
        }).fail(function(error) {
            console.log("There was an error", error);
        });;
    });

    //Redo search with saved search item
    $('.saved-searches').on('click', 'li .search-term', function(event) {
        event.preventDefault();
        var searchItem = {
            "searchTerm": $(this).closest('li').attr('id')
        };
        handleSearching(searchItem).done(function(data) {
            resultsList.html('');
            searchBox.val('');
            data.forEach(function(result) {
                resultsList.append(resultsTemplate(result));
            });
        }).fail(function(error) {
            console.log("There was an error", error);
        });;
    });
    //Delegate action for deleting saved searches
    $('.saved-searches').on('click', '.badge', function(event) {
        event.stopPropagation();
        $(this).closest('li').remove();
    });
});
function handleSearching(searchItem) {
    return $.ajax({
        "url": 'http://localhost:9000/wikiview',
        "method": "POST",
        "data": JSON.stringify(searchItem),
        "dataType": "json",
        "contentType": "application/json"
    });
}

