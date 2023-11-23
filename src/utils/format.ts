export const formatDate = (date: Date) => {
  const data = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'America/Sao_Paulo',
  };

  const formater = new Intl.DateTimeFormat('pt-BR', options);
  const dateFormated = formater.format(data);

  return dateFormated;
};
