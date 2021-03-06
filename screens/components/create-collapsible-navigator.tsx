import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  TabActionHelpers,
  TabActions,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import {useEffect, useRef} from 'react';
import {CollapsibleRef, Tabs} from 'react-native-collapsible-tab-view';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';

type TabNavigationConfig = {
  collapsibleOptions: Omit<
    React.ComponentPropsWithoutRef<typeof Tabs['Container']>,
    'children'
  >;
};

type TabNavigationOptions = {
  title?: string;
};

// Map of event name and the type of data (in event.data)
//
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type TabNavigationEventMap = {
  tabPress: {
    data: {isAlreadyFocused: boolean};
    canPreventDefault?: true;
  };
};

type Props = DefaultNavigatorOptions<TabNavigationOptions> &
  TabRouterOptions &
  TabNavigationConfig;

function CollapsibleTabNavigator({
  initialRouteName,
  children,
  screenOptions,
  collapsibleOptions,
}: Props) {
  const {state, navigation, descriptors} = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
    TabNavigationOptions,
    TabNavigationEventMap
  >(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  const ref = useRef<CollapsibleRef<TabName>>();

  const onTabChange = React.useCallback(
    ({tabName}) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: tabName.toString(),
        data: {
          isAlreadyFocused:
            tabName.toString() === state.routes[state.index].name,
        },
      });
      //@ts-ignore
      if (!event.defaultPrevented) {
        navigation.dispatch({
          ...TabActions.jumpTo(tabName.toString()),
          target: state.key,
        });
      }
    },
    [navigation, state.index, state.key, state.routes],
  );

  return (
    <Tabs.Container
      ref={ref}
      {...collapsibleOptions}
      initialTabName={state.routeNames[state.index]}
      onTabChange={onTabChange}
    >
      {state.routes.map((route) => (
        <Tabs.Tab
          name={route.name}
          key={route.key}
          label={descriptors[route.key].options.title}
        >
          <Tabs.ScrollView>
          {descriptors[route.key].render()}
          </Tabs.ScrollView>
        </Tabs.Tab>
      ))}
    </Tabs.Container>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  TabNavigationOptions,
  TabNavigationEventMap,
  typeof CollapsibleTabNavigator
>(CollapsibleTabNavigator);