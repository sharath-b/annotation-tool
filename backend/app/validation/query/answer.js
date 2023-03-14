module.exports = {
  create_no_answer: {
    question_id: 'integer',
    answer_category: 'string',
  },
  create: {
    question_id: 'integer',
    start_offset: 'integer',
    end_offset: 'integer',
    selected_text: 'string',
  },
  update: {
    question_id: 'integer',
    start_offset: 'integer',
    end_offset: 'integer',
    selected_text: 'string',
  },
};
