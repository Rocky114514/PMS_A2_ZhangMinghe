//24833060-202300408073-张洺赫MingheZhang
import { Component } from '@angular/core';

/**
 * HelpComponent: Implements the mandatory 'Help & FAQ' page required by the project brief.
 * This view provides users with troubleshooting guidance and system usage instructions.
 */
@Component({
  selector: 'app-help',
  standalone: true, // Utilizes modern independent component architecture (ULO2)
  imports: [],
  templateUrl: './help.component.html', // Renders the static FAQ and support content
  styleUrl: './help.component.css'     // Applies dedicated styling for the user guide layout
})
export class HelpComponent {
  /* 
   * Currently, this class manages static content within the template. 
   * It is designed to be easily extendable for dynamic FAQ data or interactive accordions.
   */
}