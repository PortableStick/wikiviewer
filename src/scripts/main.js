import $ from 'jquery';
import Handlebars from 'handlebars';
import { Observable } from 'rxjs';

const $searchBox = $('#search-term'),
        $resultsList = $('#results-list'),
        $topSearches = $('.top-searches'),
        resultsTemplate = Handlebars.compile($('#result-template').html()),
        topSearchTemplate = Handlebars.compile($('#top-search-template').html());

Observable.fromEvent(document, 'DOMContentLoaded')
    .flatMap(() => Observable.ajax('http://localhost:9000/wikiview/top25'))
    .map(response => response.response)
    .flatMap(response => response)
    .map(response => ({title: response.title.replace(/_/g, ' '), url: response.url}))
    .subscribe(searchTerm => {
        $topSearches.append(topSearchTemplate(searchTerm));
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

