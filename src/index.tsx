import { render } from 'solid-js/web';
import App from './App';
import './index.css';
import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey('Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-055923}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Braincode_Solution}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{2_March_2025}____[v3]_[0102]_MTc0MDg3MzYwMDAwMA==0c174c71f85e83315cc0f42a10c3c21c');


render(() => <App />, document.getElementById('root') as HTMLElement);
