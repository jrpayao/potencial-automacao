import { CreateAvaliacaoDto } from './create-avaliacao.dto.js';

export type DraftAvaliacaoDto = Partial<Omit<CreateAvaliacaoDto, 'processoId'>>;
