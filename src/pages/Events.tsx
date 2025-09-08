import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Plus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EventManager } from '@/components/teacher/EventManager';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManager, setShowManager] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => isUpcoming(event.event_date));
  const pastEvents = events.filter(event => !isUpcoming(event.event_date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">School events and activities</p>
        </div>
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <Button onClick={() => setShowManager(!showManager)}>
            <Plus className="mr-2 h-4 w-4" />
            {showManager ? 'View Events' : 'Manage Events'}
          </Button>
        )}
      </div>

      {showManager && (profile?.role === 'teacher' || profile?.role === 'admin') ? (
        <EventManager />
      ) : (
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="grid gap-6">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-600 text-center">
                      There are no upcoming events scheduled at the moment.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                upcomingEvents.map((event) => {
                  const { date, time } = formatDate(event.event_date);
                  return (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                School Staff
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {time}
                              </div>
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            Upcoming
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{event.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Events</h2>
              <div className="grid gap-6">
                {pastEvents.map((event) => {
                  const { date, time } = formatDate(event.event_date);
                  return (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-300 opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                School Staff
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {time}
                              </div>
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary">
                            Past Event
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{event.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;