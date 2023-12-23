// SampleNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import MyOrganizationPage from "./MyOrganizationPage";
import CreateOrganizationPage from "./CreateOrganizationPage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyOrganization" component={MyOrganizationPage} />
      <Stack.Screen name="CreateOrganization" component={CreateOrganizationPage} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
