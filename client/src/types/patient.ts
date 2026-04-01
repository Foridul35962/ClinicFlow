export type appointmentType = {
    doctorId: string
}

export interface AppointmentProps {
  appointmentValue: {
    appointment: {
      _id: string;
      patientId: string;
      doctorId: string;
      date: string;
      slotStart: string;
      slotEnd: string;
      status: string;
      qrHash: string;
      checkedIn: boolean;
      createdAt: string;
      updatedAt: string;
    };
    qrImage: string;
  };
}