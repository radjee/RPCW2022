function sortTable(n,numero) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tabela");
    switching = true;
    dir = "asc";

    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {

        shouldSwitch = false;
        
        if (numero) {
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        var x = rows[i].getElementsByTagName("TD")[n];
        var y = rows[i + 1].getElementsByTagName("TD")[n];
       
          x = x.innerHTML.replace(":",".")
          y = y.innerHTML.replace(":",".")
          if (dir == "asc") {
            if (Number(x) > Number(y)) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (Number(x) < Number(y)) {
              shouldSwitch = true;
              break;
            }
          }
        } else {
          var x = rows[i].getElementsByTagName("TD")[n].lastChild.textContent;
          var y = rows[i + 1].getElementsByTagName("TD")[n].lastChild.textContent;
          /* Check if the two rows should switch place,
          based on the direction, asc or desc: */
          if (dir == "asc") {
            if (x.toLowerCase().localeCompare(y.toLowerCase(),undefined, { numeric: true, sensitivity: 'base'}) == "1") {
              shouldSwitch = true;
              break;
            }
            //if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //  // If so, mark as a switch and break the loop:
            //  shouldSwitch = true;
            //  break;
            //}
          } else if (dir == "desc") {
            if (x.toLowerCase().localeCompare(y.toLowerCase(),undefined, { numeric: true, sensitivity: 'base'}) == "-1") {
              shouldSwitch = true;
              break;
            }
            //if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //  // If so, mark as a switch and break the loop:
            //  shouldSwitch = true;
            //  break;
            //}
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }