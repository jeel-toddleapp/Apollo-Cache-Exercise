import Loader from '../Loader';

import './withLoader.css';

const getHOCDisplayName = (component) =>
  component.displayName || component.name || 'Component';

function withLoader(Component) {
  const WrappedComponent = (props) => {
    const { isData, isLoading, ...rest } = props;
    if (isData) {
      return (
        <div data-component={getHOCDisplayName(Component)}>
          <Component {...rest} />
        </div>
      );
    }

    if (isLoading && !isData) {
      return (
        <div className={'loaderContainer'}>
          <Loader />
        </div>
      );
    }

    console.log('Inside withLoader');
    console.log('isData::', isData);
    console.log('isLoading::', isLoading);
    // No data found in cache and no request is going for the query
    // return <div>No data found from the cache</div>;
    return null;
  };

  return WrappedComponent;
}

export default withLoader;
