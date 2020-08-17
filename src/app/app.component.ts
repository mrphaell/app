import { Component, OnInit } from '@angular/core';
import { Evento } from './models/evento'
import { CalendarOptions } from '@fullcalendar/angular';
import { EventoService } from './services/evento/evento.service';
import { SalaService } from './services/sala/sala.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  insert = false;
  editing = false;
  eventos: any[];
  salas: any[];

  public evento: Evento = {} as Evento
  displayedColumns: string[] = ['actions', 'NomeResponsavel', 'Sala', 'DataInicio', 'DataFim'];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    editable: false,
    eventOverlap: false,
    eventClick: info => {
      const evento = info.event._def.extendedProps;
      this.evento.NomeResponsavel = evento.NomeResponsavel;
      this.evento.DataInicio = new Date(info.event.start);
      const end = new Date(info.event.end);
      this.evento.DataFim = new Date(end.setDate(end.getDate() - 1));
      const sala = this.salas.find(sl => sl.Id == evento.IdSala);
      this.evento.IdSala = sala.Id;
      this.evento.Id = evento.Id;
      this.editing = true;
    },
    events: this.eventos
  };

  addEvent(): void {
    this.insert = true;
  }

  insertEvent() {
    const _success = (success) => {
      this.insert = false;
      this.load(true);
      this.evento = new Evento();
    }

    const _error = (error) => {
      console.log(error);
      alert(error.error.ExceptionMessage);
    }

    this.service.post(this.evento).subscribe(
      (success) => _success(success),
      (error) => _error(error)
    );
  }

  cancelar() {
    this.editing = false;
    this.insert = false;
    this.evento = new Evento();
  }

  salvar() {
    if (this.insert)
      this.insertEvent();
    else if (this.editing)
      this.edit();
  }

  edit() {
    const _success = (success) => {
      this.editing = false;
      this.evento = new Evento();
      this.load(true);
    }

    const _error = (error) => {
      console.log(error);
      alert(error.error.ExceptionMessage);
    }

    this.service.put(this.evento).subscribe(
      (success) => _success(success),
      (error) => _error(error)
    );
  }

  delete(ev) {
    const _success = (success) => {
      this.load(true);
    }

    const _error = (error) => {
      console.log(error);
      alert(error.error.ExceptionMessage);
    }

    this.service.delete(ev.Id).subscribe(
      (success) => _success(success),
      (error) => _error(error)
    );
  }

  constructor(private service: EventoService, private salaService: SalaService) {
    this.load()
  }

  async load(loaded = false) {
    const eventos = await this.service.get().toPromise();
    if (!loaded) {
      const salas = await this.salaService.get().toPromise();
      this.salas = salas;
    }

    this.eventos = eventos;

    this.eventos.forEach(element => {
      element.title = element.Sala + ' - ' + element.NomeResponsavel;
      element.start = new Date(element.DataInicio);
      let end = new Date(element.DataFim);
      element.end = end.setDate(end.getDate() + 1);
      element.DataInicio = moment(element.DataInicio).format('DD/MM/YYYY');
      element.DataFim = moment(element.DataFim).format('DD/MM/YYYY');
    });

    this.calendarOptions.events = this.eventos
  }
}
