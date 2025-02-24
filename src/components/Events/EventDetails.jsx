import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { fetchEvent, deleteEvent, queryClient } from '../../util/http.js';

export default function EventDetails() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {data, isPending, isError, error} = useQuery({
    queryKey: ["events", id],
    queryFn: ({signal}) => fetchEvent({id, signal})
  });
  const {mutate, isMutationPending, isMutationError, mutationError} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"]
      });
      navigate("/events");
    }
  });

  function handleDelete() {
    mutate({id});
  }
  
  let content;

  if(isPending) {
    content = <div id="event-details-content" className="center">
      <p>Fetching event data...</p>
    </div>;
  }

  if(isError) {
    content = <ErrorBlock title="Failed to load event" message={error.info?.message || "Failed to fetch event data, please try agian later."} />; 
  }

  if(data) {
    const formattedDate = new Date(data.data).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    content = <article id="event-details">
      <header>
        <h1>{data.title}</h1>
        <nav>
          <button onClick={handleDelete}>Delete</button>
          <Link to="edit">Edit</Link>
        </nav>
      </header>
      <div id="event-details-content">
        <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </div>
    </article>;
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
