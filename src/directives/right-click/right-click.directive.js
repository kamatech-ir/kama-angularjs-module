kamaRightClick.$inject = ["$parse"];
export default function kamaRightClick($parse) {
  const directive = {
    link: link,
    restrict: 'A',
  };

  return directive;

  function link(scope, element, attrs) {
    debugger;
    if (attrs.kamaRightClick) {
        const fn = $parse(attrs.kamaRightClick);
    
        element.bind('contextmenu', (event) => {
            scope.$apply(function() {
                // prevent the default context menu
                event.preventDefault();
    
                fn(scope, {$event:event});
            });
        });
    }
  }
}
