# Home Landing Page Behavior Enhancement

## Objective
Enhance the **Home Landing** page so that when a search is performed for any category (Hotel, Flights, Packages):

 1. The corresponding **list view section** is displayed below the search widget.(Already implemented)
 2. The ListView when in loading state instead of circular loader, create a skeleton loader for 3 different list view.
 3. There should be a progress bar at the top of the list view (below the search widget) indicating the progress of the search. Don't use the progress bar from the search widget. 
 4. The progress bar should start smoothly and end smoothly. till response is received for now it can be simulated with a delay of 2 seconds when mock data is used. 
 5. The Room Addition modal should be scrollable and the height can be bit more it is not scrollable now and UI is breaking when two rooms gets added in the list and for 3rd room it is not visible.
 6. Search Icon in the widget can be better and more prominent.
 7. I realized there is a bug when I try to click on search button, the transition happens but suddenly nothing happen not even the search. I have to refresh the page do some date selection then the search button flow works as expected.
 8. Only call the location search APi when user enter something in the search destination field.
 9. For now increase the objects in mock data for list view to 15.
 10. Home hero section should have some sample contents for travel website lets keep it static for now. I donot know exactly what to keep but just a simple view modern design.
 11. The list view should be smoothly scrollable and there is no y-gap even tho I have mentioned it is not working I guess due to virtualization. please fix that as well I want virtualization tho.
 12. The hotel card refundable icon should be "R" in green color and remove carousl dots and heart icon from the card.
 13. the header background should be glass morphism blur texture..
 14. If possible STAYA should be like NIKE font
 15. The search result view, the widget has some top padding we can reduce that so that the logo and the more option and widget are properly aligned to the top in that view. doesn't mean remove the entire top padding
 


