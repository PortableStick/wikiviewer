import $ from 'jquery';
import Handlebars from 'handlebars';
import { Observable } from 'rxjs';

const $searchBox = $('#search-term'),
        $resultsList = $('#results-list'),
        $savedSearches = $('.saved-searches'),
        resultsTemplate = Handlebars.compile($('#result-template').html()),
        savedSearchTemplate = Handlebars.compile($('#saved-search-template').html());

Observable.fromEvent(document, 'load').flatMap(Observable.create(observer => {
    if (localStorage.getItem('searches')) {
        observer.next(JSON.parse(localStorage.getItem('searches')));
    } else {
        observer.next([]);
    }
})).subscribe(searchTerm => {
    if(searchTerm.length > 0) {
        savedSearches.append(savedSearchTemplate({
            "searchTerm": searchTerm
        }));
    }
});

Observable.fromEvent($searchBox, 'keyup')
.debounceTime(500)
.distinctUntilChanged()
.map(e => ({"searchTerm": e.target.value}))
.filter(term => term.searchTerm.length > 0)
.flatMap(term => Observable.ajax({
        "url": 'http://localhost:9000/wikiview',
        "method": "POST",
        "body": term,
        "responseType": "json",
        "headers": {
            "Content-Type": "application/json"
        }
    }))
.do(() => {
    $resultsList.html('');
})
.map(response => response.response)
.flatMap(response => response)
.subscribe(data => {
    $resultsList.append(resultsTemplate(data));
});

