$(document).ready(function() {
    var searchBox = $('#search-term'),
        resultsList = $('#results-list'),
        savedSearches = $('.saved-searches'),
        resultsTemplate = Handlebars.compile($('#result-template').html()),
        savedSearchTemplate = Handlebars.compile($('#saved-search-template').html()),
        persistedSearches = ( function() {
            if (localStorage.getItem('searches')) {
                return JSON.parse(localStorage.getItem('searches'));
            } else {
                return [];
            }
        }());
    persistedSearches.forEach(function(search) {
        savedSearches.append(savedSearchTemplate({
            "searchTerm": search
        }));
    });
    //Submit button handler
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
            if (persistedSearches.indexOf(searchItem.searchTerm) === -1) {
                persistedSearches.push(searchItem.searchTerm);
            }
            localStorage.setItem('searches', JSON.stringify(persistedSearches));
            searchBox.val('');
        }).fail(function(error) {
            console.error("There was an error", error);
        });
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
            console.error("There was an error", error);
        });;
    });
    //Delegate action for deleting saved searches
    $('.saved-searches').on('click', '.badge', function(event) {
        event.stopPropagation();
        var target = $(this).closest('li'),
            targetIndex = persistedSearches.indexOf(target.attr('id'));
        persistedSearches.splice(targetIndex, 1);
        localStorage.setItem('searches', JSON.stringify(persistedSearches));
        target.remove();
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

